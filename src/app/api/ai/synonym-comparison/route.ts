import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildSynonymUserPrompt,
  SYNONYM_MODEL,
  SYNONYM_PROMPT_VERSION,
  SYNONYM_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import {
  getSynonymContext,
  synonymComparisonSchema,
  validateAndOrderComparison,
} from "@/lib/ai/synonym-comparison";
import { createOpenAIClient } from "@/lib/ai/openai-client";
import {
  createSynonymGroupKey,
  readSynonymComparisonCache,
  writeSynonymComparisonCache,
} from "@/lib/ai/synonym-comparison-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.strictObject({
  targetWord: z.string().trim().min(1),
});

const OPENAI_TIMEOUT_MS = 60_000;

function errorResponse() {
  return NextResponse.json(
    { error: "SYNONYM_COMPARISON_FAILED" },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

function successResponse(
  comparison: ReturnType<typeof validateAndOrderComparison>,
  source: "cache" | "generated",
) {
  return NextResponse.json(
    {
      comparison,
      ...(process.env.NODE_ENV === "development" ? { source } : {}),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function logPersistenceFailure(
  operation: "read" | "write" | "validation",
  groupKey: string,
  error: unknown,
) {
  if (process.env.NODE_ENV !== "development") return;

  const details = error && typeof error === "object"
    ? error as {
        name?: unknown;
        code?: unknown;
        message?: unknown;
        details?: unknown;
        hint?: unknown;
      }
    : undefined;

  console.warn("[AI synonym persistence] non-blocking failure", {
    operation,
    groupKey,
    errorName: typeof details?.name === "string" ? details.name : "PersistenceError",
    code: typeof details?.code === "string" ? details.code : undefined,
    message: typeof details?.message === "string" ? details.message : "Unknown failure",
    details: typeof details?.details === "string" ? details.details : undefined,
    hint: typeof details?.hint === "string" ? details.hint : undefined,
  });
}

function getSafeErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { errorType: "UnknownError", errorName: "UnknownError", message: "Unknown failure" };
  }

  const sdkError = error as Error & {
    status?: unknown;
    code?: unknown;
    type?: unknown;
    requestID?: unknown;
    cause?: unknown;
  };
  const cause = sdkError.cause && typeof sdkError.cause === "object"
    ? sdkError.cause as { name?: unknown; code?: unknown; message?: unknown }
    : undefined;

  return {
    errorType: error.constructor.name,
    errorName: error.name,
    message: error.message,
    status: typeof sdkError.status === "number" ? sdkError.status : undefined,
    code: typeof sdkError.code === "string" ? sdkError.code : undefined,
    type: typeof sdkError.type === "string" ? sdkError.type : undefined,
    requestId: typeof sdkError.requestID === "string" ? sdkError.requestID : undefined,
    causeName: typeof cause?.name === "string" ? cause.name : undefined,
    causeCode: typeof cause?.code === "string" ? cause.code : undefined,
    causeMessage: typeof cause?.message === "string" ? cause.message : undefined,
  };
}

export async function POST(request: Request) {
  const startedAt = performance.now();
  let targetWord = "unknown";
  let failurePhase = "request-validation";
  let transport: "direct" | "proxy" = "direct";

  try {
    const body = requestSchema.parse(await request.json());
    targetWord = body.targetWord;

    failurePhase = "vocabulary-context";
    const context = getSynonymContext(targetWord);
    const groupKey = createSynonymGroupKey(context.comparisonWords);

    failurePhase = "cache-read";
    try {
      const cached = await readSynonymComparisonCache(groupKey);
      if (cached?.promptVersion === SYNONYM_PROMPT_VERSION) {
        try {
          const comparison = validateAndOrderComparison(
            cached.result,
            context.comparisonWords,
          );

          if (process.env.NODE_ENV === "development") {
            console.info("[AI synonym persistence] cache hit", {
              groupKey,
              promptVersion: SYNONYM_PROMPT_VERSION,
              latencyMs: Math.round(performance.now() - startedAt),
            });
          }

          return successResponse(comparison, "cache");
        } catch (error) {
          logPersistenceFailure("validation", groupKey, error);
        }
      }
    } catch (error) {
      logPersistenceFailure("read", groupKey, error);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY_MISSING");

    const openAIClient = createOpenAIClient(apiKey);
    const openai = openAIClient.client;
    transport = openAIClient.transport;
    const timeoutSignal = AbortSignal.timeout(OPENAI_TIMEOUT_MS);
    const signal = AbortSignal.any([request.signal, timeoutSignal]);

    failurePhase = "openai-request-or-structured-parse";
    const response = await openai.responses.parse(
      {
        model: SYNONYM_MODEL,
        input: [
          { role: "system", content: SYNONYM_SYSTEM_PROMPT },
          {
            role: "user",
            content: buildSynonymUserPrompt(
              context.targetWord,
              context.comparisonWords,
              context.entries,
            ),
          },
        ],
        text: {
          format: zodTextFormat(synonymComparisonSchema, "synonym_comparison"),
        },
        max_output_tokens: 1_200,
      },
      { signal },
    );

    failurePhase = "structured-output-check";
    if (!response.output_parsed) throw new Error("EMPTY_OR_REFUSED_RESPONSE");

    failurePhase = "runtime-validation";
    const comparison = validateAndOrderComparison(
      response.output_parsed,
      context.comparisonWords,
    );

    failurePhase = "cache-write";
    try {
      await writeSynonymComparisonCache({
        groupKey,
        words: context.comparisonWords,
        result: comparison,
        promptVersion: SYNONYM_PROMPT_VERSION,
        model: SYNONYM_MODEL,
      });
    } catch (error) {
      logPersistenceFailure("write", groupKey, error);
    }

    if (process.env.NODE_ENV === "development") {
      const usage = response.usage;
      console.info("[AI synonym generation]", {
        targetGroup: context.comparisonWords.join(" / "),
        model: SYNONYM_MODEL,
        promptVersion: SYNONYM_PROMPT_VERSION,
        transport,
        inputTokens: usage?.input_tokens,
        outputTokens: usage?.output_tokens,
        totalTokens: usage?.total_tokens,
        latencyMs: Math.round(performance.now() - startedAt),
      });
    }

    return successResponse(comparison, "generated");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[AI synonym generation] request failed", {
        targetWord,
        model: SYNONYM_MODEL,
        promptVersion: SYNONYM_PROMPT_VERSION,
        failurePhase,
        configuredTimeoutMs: OPENAI_TIMEOUT_MS,
        transport,
        latencyMs: Math.round(performance.now() - startedAt),
        ...getSafeErrorDetails(error),
      });
    }
    return errorResponse();
  }
}

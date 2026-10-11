import "server-only";

import OpenAI from "openai";
import { fetch as undiciFetch, ProxyAgent } from "undici";

let proxyAgent: ProxyAgent | undefined;
let proxyAgentUrl: string | undefined;

function getProxyAgent(proxyUrl: string) {
  if (!proxyAgent || proxyAgentUrl !== proxyUrl) {
    void proxyAgent?.close();
    proxyAgent = new ProxyAgent(proxyUrl);
    proxyAgentUrl = proxyUrl;
  }

  return proxyAgent;
}

export function createOpenAIClient(apiKey: string) {
  const proxyUrl = process.env.OPENAI_PROXY_URL?.trim();

  if (!proxyUrl) {
    return {
      client: new OpenAI({ apiKey, maxRetries: 0 }),
      transport: "direct" as const,
    };
  }

  return {
    client: new OpenAI({
      apiKey,
      maxRetries: 0,
      fetch: undiciFetch as unknown as typeof globalThis.fetch,
      fetchOptions: {
        dispatcher: getProxyAgent(proxyUrl),
      },
    }),
    transport: "proxy" as const,
  };
}

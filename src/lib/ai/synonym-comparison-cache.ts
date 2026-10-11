import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { SynonymComparison } from "@/lib/ai/synonym-comparison";

const TABLE_NAME = "ai_synonym_comparisons";

export type SynonymComparisonCacheRecord = {
  groupKey: string;
  words: string[];
  result: unknown;
  promptVersion: string;
  model: string;
};

export function createSynonymGroupKey(words: string[]) {
  return [...new Set(words.map((word) => word.trim().toLowerCase()))]
    .sort((left, right) => left.localeCompare(right, "en"))
    .join("|");
}

export async function readSynonymComparisonCache(
  groupKey: string,
): Promise<SynonymComparisonCacheRecord | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("group_key, words, result, prompt_version, model")
    .eq("group_key", groupKey)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    groupKey: data.group_key,
    words: data.words,
    result: data.result,
    promptVersion: data.prompt_version,
    model: data.model,
  };
}

export async function writeSynonymComparisonCache(input: {
  groupKey: string;
  words: string[];
  result: SynonymComparison;
  promptVersion: string;
  model: string;
}) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        group_key: input.groupKey,
        words: input.words,
        result: input.result,
        prompt_version: input.promptVersion,
        model: input.model,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "group_key" },
    );

  if (error) throw error;
}

import "server-only";

import vocabulary from "@/data/vocabulary.json";
import { z } from "zod";

export const synonymComparisonSchema = z.strictObject({
  differences: z.array(
    z.strictObject({
      word: z.string().trim().min(1),
      keyword: z.string().trim().min(1),
      note: z.string().trim().min(1),
    }),
  ),
  interchangeability: z.strictObject({
    level: z.enum(["yes", "partial", "no"]),
    explanation: z.string().trim().min(1),
  }),
});

export type SynonymComparison = z.infer<typeof synonymComparisonSchema>;

type VocabularyEntry = (typeof vocabulary.words)[number];

const entriesByWord = new Map<string, VocabularyEntry>(
  vocabulary.words.map((entry) => [entry.word.toLowerCase(), entry]),
);

export function getSynonymContext(targetWord: string) {
  const normalizedTarget = targetWord.trim().toLowerCase();
  const targetEntry = entriesByWord.get(normalizedTarget);

  if (!targetEntry) {
    throw new Error("TARGET_WORD_NOT_FOUND");
  }

  const groupWordSet = new Set(
    [targetEntry.word, ...targetEntry.synonyms].map((word) => word.toLowerCase()),
  );
  const comparisonWords = vocabulary.words
    .filter((entry) => groupWordSet.has(entry.word.toLowerCase()))
    .map((entry) => entry.word);
  const uniqueWords = [...new Set(comparisonWords.map((word) => word.toLowerCase()))];

  if (
    uniqueWords.length !== comparisonWords.length
    || comparisonWords.length !== groupWordSet.size
    || comparisonWords.length < 2
  ) {
    throw new Error("SYNONYM_GROUP_NOT_FOUND");
  }

  const entries = comparisonWords.map((word) => entriesByWord.get(word.toLowerCase()));
  if (entries.some((entry) => !entry)) {
    throw new Error("VOCABULARY_CONTEXT_MISSING");
  }

  return {
    targetWord: targetEntry.word,
    comparisonWords,
    entries: (entries as VocabularyEntry[]).map((entry) => ({
      word: entry.word,
      phonetic: entry.phonetic,
      meanings: entry.meanings.map(({ partOfSpeech, definitionZh }) => ({
        partOfSpeech,
        definitionZh,
      })),
      collocations: entry.collocations,
      exampleSentences: entry.exampleSentences,
      synonyms: entry.synonyms,
    })),
  };
}

export function validateAndOrderComparison(
  value: unknown,
  comparisonWords: string[],
): SynonymComparison {
  const parsed = synonymComparisonSchema.parse(value);
  if (parsed.differences.length !== comparisonWords.length) {
    throw new Error("INVALID_DIFFERENCE_COUNT");
  }

  const differencesByWord = new Map<string, SynonymComparison["differences"][number]>();
  for (const difference of parsed.differences) {
    const normalizedWord = difference.word.toLowerCase();
    if (differencesByWord.has(normalizedWord)) {
      throw new Error("DUPLICATE_DIFFERENCE_WORD");
    }
    differencesByWord.set(normalizedWord, difference);
  }

  const expectedWords = new Set(comparisonWords.map((word) => word.toLowerCase()));
  if ([...differencesByWord.keys()].some((word) => !expectedWords.has(word))) {
    throw new Error("UNEXPECTED_DIFFERENCE_WORD");
  }

  const orderedDifferences = comparisonWords.map((word) => {
    const difference = differencesByWord.get(word.toLowerCase());
    if (!difference) throw new Error("MISSING_DIFFERENCE_WORD");
    return { ...difference, word };
  });

  return {
    differences: orderedDifferences,
    interchangeability: parsed.interchangeability,
  };
}

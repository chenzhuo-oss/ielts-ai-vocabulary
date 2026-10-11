import vocabularyData from "@/data/vocabulary.json";
import { getAllLearningStates, type LearningState } from "@/lib/learning-state";

export const CURRENT_PACK_STORAGE_KEY = "ielts-ai-vocabulary:current-pack-id";
export const DEFAULT_PACK_ID = "ielts_core_v1";

export type PackAvailability = "available" | "comingSoon" | "unavailable";

export type VocabularyPack = {
  id: string;
  name: string;
  nameEn: string;
  availability: PackAvailability;
  totalWordCount: number;
  words: typeof vocabularyData.words;
};

export type PackWordStatus = "unlearned" | "learned" | "review";

const availablePack: VocabularyPack = {
  id: vocabularyData.id,
  name: "IELTS 核心单词",
  nameEn: vocabularyData.name,
  availability: "available",
  totalWordCount: vocabularyData.words.length,
  words: vocabularyData.words,
};

export const VOCABULARY_PACKS: VocabularyPack[] = [
  availablePack,
  {
    id: "ielts_academic_v1",
    name: "IELTS 学术词汇",
    nameEn: "IELTS Academic Vocabulary",
    availability: "comingSoon",
    totalWordCount: 0,
    words: [],
  },
  {
    id: "ielts_scenarios_v1",
    name: "IELTS 高频场景词汇",
    nameEn: "IELTS High-frequency Topics",
    availability: "comingSoon",
    totalWordCount: 0,
    words: [],
  },
];

export function getVocabularyPack(packId: string): VocabularyPack | null {
  return VOCABULARY_PACKS.find((pack) => pack.id === packId) ?? null;
}

export function getCurrentPackId(): string {
  if (typeof window === "undefined") return DEFAULT_PACK_ID;
  const storedId = window.localStorage.getItem(CURRENT_PACK_STORAGE_KEY);
  return getVocabularyPack(storedId ?? "")?.availability === "available"
    ? storedId!
    : DEFAULT_PACK_ID;
}

export function getWordFirstLearningCompleted(
  state: LearningState | undefined,
): boolean {
  // `todayMastered` is a safe legacy migration signal: a word that has ever
  // reached this state has necessarily completed its first-learning flow.
  return (
    state?.firstLearningCompleted === true ||
    state?.todayMastered === true ||
    state?.status === "know"
  );
}

export function getPackWordStatus(
  state: LearningState | undefined,
): PackWordStatus {
  if (!getWordFirstLearningCompleted(state)) return "unlearned";
  return state?.inReviewPool ? "review" : "learned";
}

export function getPackProgress(packId: string, developmentTest = false) {
  const pack = getVocabularyPack(packId);
  if (!pack) return { learnedWordCount: 0, reviewPoolCount: 0, totalWordCount: 0 };
  const states = getAllLearningStates(developmentTest);
  const uniqueWordIds = [...new Set(pack.words.map((word) => word.id))];
  return {
    learnedWordCount: uniqueWordIds.filter((id) =>
      getWordFirstLearningCompleted(states[id]),
    ).length,
    reviewPoolCount: uniqueWordIds.filter((id) => states[id]?.inReviewPool).length,
    totalWordCount: uniqueWordIds.length,
  };
}

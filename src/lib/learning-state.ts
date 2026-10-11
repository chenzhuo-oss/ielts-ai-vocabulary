export const LEARNING_STATE_STORAGE_KEY = "ielts-ai-vocabulary:learning-states";
export const DEVELOPMENT_TEST_LEARNING_STATE_STORAGE_KEY =
  "ielts-ai-vocabulary:development-learning-test-states";

export type LearningStatus = "know" | "unknown";

export type LearningState = {
  wordId: string;
  status: LearningStatus;
  inReviewPool: boolean;
  todayMastered: boolean;
  dailyConsecutiveKnowCount: number;
  firstLearningCompleted: boolean;
  updatedAt: string;
};

export type LearningOutcome = Pick<
  LearningState,
  "status" | "inReviewPool" | "todayMastered" | "dailyConsecutiveKnowCount"
> & { wasUnknownToday: boolean };

export function getLearningOutcome({
  itemType,
  status,
  previousState,
  dailyConsecutiveKnowCount,
  wasUnknownToday,
}: {
  itemType: "new" | "review";
  status: LearningStatus;
  previousState: LearningState | null;
  dailyConsecutiveKnowCount: number;
  wasUnknownToday: boolean;
}): LearningOutcome {
  if (status === "know" && !wasUnknownToday) {
    return {
      status,
      inReviewPool:
        itemType === "review" || Boolean(previousState?.inReviewPool),
      todayMastered: true,
      dailyConsecutiveKnowCount: 0,
      wasUnknownToday: false,
    };
  }

  if (status === "unknown") {
    return {
      status,
      inReviewPool: true,
      todayMastered: false,
      dailyConsecutiveKnowCount: 0,
      wasUnknownToday: true,
    };
  }

  const nextConsecutiveKnowCount = dailyConsecutiveKnowCount + 1;
  return {
    status,
    inReviewPool: true,
    todayMastered: nextConsecutiveKnowCount >= 3,
    dailyConsecutiveKnowCount: nextConsecutiveKnowCount,
    wasUnknownToday: true,
  };
}

type LearningStateStore = Record<string, LearningState>;

function getLearningStateStorageKey(developmentTest = false): string {
  return process.env.NODE_ENV === "development" && developmentTest
    ? DEVELOPMENT_TEST_LEARNING_STATE_STORAGE_KEY
    : LEARNING_STATE_STORAGE_KEY;
}

function readStore(developmentTest = false): LearningStateStore {
  if (typeof window === "undefined") return {};

  try {
    const storedValue = window.localStorage.getItem(
      getLearningStateStorageKey(developmentTest),
    );
    if (!storedValue) return {};
    const parsedValue: unknown = JSON.parse(storedValue);
    if (parsedValue === null || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {};
    }

    const migratedStore: LearningStateStore = {};
    for (const [wordId, rawState] of Object.entries(parsedValue)) {
      if (rawState === null || typeof rawState !== "object" || Array.isArray(rawState)) continue;

      const legacyState = rawState as Record<string, unknown>;
      const legacyUnknownStatus = ["un", "familiar"].join("");
      const status = legacyState.status === legacyUnknownStatus ? "unknown" : legacyState.status;
      if (status !== "know" && status !== "unknown") continue;

      migratedStore[wordId] = {
        wordId,
        status,
        inReviewPool:
          typeof legacyState.inReviewPool === "boolean"
            ? legacyState.inReviewPool
            : status === "unknown",
        todayMastered:
          typeof legacyState.todayMastered === "boolean"
            ? legacyState.todayMastered
            : status === "know",
        dailyConsecutiveKnowCount:
          typeof legacyState.dailyConsecutiveKnowCount === "number"
            ? legacyState.dailyConsecutiveKnowCount
            : typeof legacyState.consecutiveKnowCount === "number"
              ? legacyState.consecutiveKnowCount
              : 0,
        firstLearningCompleted:
          typeof legacyState.firstLearningCompleted === "boolean"
            ? legacyState.firstLearningCompleted
            : legacyState.todayMastered === true,
        updatedAt:
          typeof legacyState.updatedAt === "string"
            ? legacyState.updatedAt
            : new Date().toISOString(),
      };
    }

    return migratedStore;
  } catch (error) {
    console.warn("无法读取学习状态，将使用空状态", error);
    return {};
  }
}

export function saveLearningState(state: LearningState, developmentTest = false): void {
  if (typeof window === "undefined") return;
  const storageKey = getLearningStateStorageKey(developmentTest);
  const nextStore: LearningStateStore = {
    ...readStore(developmentTest),
    [state.wordId]: state,
  };
  window.localStorage.setItem(storageKey, JSON.stringify(nextStore));
}

export function getLearningState(wordId: string, developmentTest = false): LearningState | null {
  return readStore(developmentTest)[wordId] ?? null;
}

export function getAllLearningStates(
  developmentTest = false,
): Record<string, LearningState> {
  return readStore(developmentTest);
}

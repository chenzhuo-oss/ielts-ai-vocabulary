import {
  DEVELOPMENT_TEST_LEARNING_STATE_STORAGE_KEY,
  getAllLearningStates,
} from "@/lib/learning-state";
export { getSessionSummary } from "@/lib/session-summary";

export const DAILY_SESSION_STORAGE_KEY = "ielts-ai-vocabulary:daily-sessions";
export const CHECK_IN_STORAGE_KEY = "ielts-ai-vocabulary:check-ins";
export const LEARNING_INTENSITY_STORAGE_KEY = "ielts-ai-vocabulary:learning-intensity";
export const LEARNING_PLAN_BY_PACK_STORAGE_KEY = "ielts-ai-vocabulary:learning-plan-by-pack";
const EXTRA_SESSION_STORAGE_KEY = "ielts-ai-vocabulary:extra-sessions";
export const DEVELOPMENT_TEST_SESSION_DATE = "development-learning-test";
export const DEVELOPMENT_TEST_SESSION_STORAGE_KEY =
  "ielts-ai-vocabulary:development-learning-test-session";
export const DEVELOPMENT_TEST_CHECK_IN_STORAGE_KEY =
  "ielts-ai-vocabulary:development-learning-test-check-ins";
export const DEVELOPMENT_SETTLEMENT_TEST_PREFIX =
  "development-settlement-test:";
export const DEVELOPMENT_SETTLEMENT_SESSION_STORAGE_KEY =
  "ielts-ai-vocabulary:development-settlement-test-sessions";
export const DEVELOPMENT_SETTLEMENT_CHECK_IN_STORAGE_KEY =
  "ielts-ai-vocabulary:development-settlement-test-check-ins";

export type LearningIntensity = "light" | "standard" | "intensive";
export type DailyItemType = "new" | "review";

export const INTENSITY_OPTIONS: Record<
  LearningIntensity,
  { label: string; newWordTarget: number; reviewLimit: number }
> = {
  light: { label: "轻量", newWordTarget: 10, reviewLimit: 20 },
  standard: { label: "标准", newWordTarget: 20, reviewLimit: 40 },
  intensive: { label: "强化", newWordTarget: 30, reviewLimit: 60 },
};

export type DailySessionItem = {
  wordId: string;
  word: string;
  type: DailyItemType;
  todayMastered: boolean;
  dailyConsecutiveKnowCount: number;
  wasUnknownToday: boolean;
};

export type DailySession = {
  packId: string;
  sessionDate: string;
  intensity: LearningIntensity;
  items: DailySessionItem[];
  currentIndex: number;
  startedAt: string | null;
  completed: boolean;
  completionTime: string | null;
};

type VocabularyWord = { id: string; word: string };
type SessionStore = Record<string, DailySession>;

export function isDevelopmentLearningTestSession(sessionDate?: string): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    sessionDate === DEVELOPMENT_TEST_SESSION_DATE
  );
}

export function isDevelopmentSettlementTestSession(sessionDate?: string): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    Boolean(sessionDate?.startsWith(DEVELOPMENT_SETTLEMENT_TEST_PREFIX))
  );
}

function getDevelopmentSettlementDate(sessionDate: string): string {
  return sessionDate.slice(DEVELOPMENT_SETTLEMENT_TEST_PREFIX.length);
}

function getSessionStorageKey(sessionDate: string): string {
  if (isDevelopmentLearningTestSession(sessionDate)) {
    return DEVELOPMENT_TEST_SESSION_STORAGE_KEY;
  }
  if (isDevelopmentSettlementTestSession(sessionDate)) {
    return DEVELOPMENT_SETTLEMENT_SESSION_STORAGE_KEY;
  }
  return DAILY_SESSION_STORAGE_KEY;
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.warn(`无法读取本地数据：${key}`, error);
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLearningIntensity(packId = "ielts_core_v1"): LearningIntensity {
  if (typeof window === "undefined") return "standard";
  const planByPack = readJson<Record<string, { planId?: LearningIntensity }>>(
    LEARNING_PLAN_BY_PACK_STORAGE_KEY,
    {},
  );
  const packPlan = planByPack[packId]?.planId;
  if (packPlan === "light" || packPlan === "standard" || packPlan === "intensive") {
    return packPlan;
  }
  const value = window.localStorage.getItem(LEARNING_INTENSITY_STORAGE_KEY);
  return value === "light" || value === "intensive" ? value : "standard";
}

export function saveLearningIntensity(
  intensity: LearningIntensity,
  packId = "ielts_core_v1",
): void {
  if (typeof window === "undefined") return;
  const plans = readJson<Record<string, unknown>>(LEARNING_PLAN_BY_PACK_STORAGE_KEY, {});
  const option = INTENSITY_OPTIONS[intensity];
  writeJson(LEARNING_PLAN_BY_PACK_STORAGE_KEY, {
    ...plans,
    [packId]: {
      mode: "preset",
      planId: intensity,
      newWordCount: option.newWordTarget,
      reviewCap: option.reviewLimit,
    },
  });
}

export function getDailySession(sessionDate: string): DailySession | null {
  const storedSession = readJson<SessionStore & Record<string, unknown>>(
    getSessionStorageKey(sessionDate),
    {},
  )[sessionDate];
  if (!storedSession || typeof storedSession !== "object") return null;

  const legacySession = storedSession as DailySession & {
    completedAt?: string | null;
    completed?: boolean;
    completionTime?: string | null;
  };
  const completionTime = legacySession.completionTime ?? legacySession.completedAt ?? null;
  return {
    ...legacySession,
    packId: legacySession.packId ?? "ielts_core_v1",
    items: legacySession.items.map((item) => ({
      ...item,
      dailyConsecutiveKnowCount: item.dailyConsecutiveKnowCount ?? 0,
      wasUnknownToday: item.wasUnknownToday ?? false,
    })),
    completed: legacySession.completed ?? Boolean(completionTime),
    completionTime,
  };
}

export function saveDailySession(session: DailySession): void {
  const storageKey = getSessionStorageKey(session.sessionDate);
  const sessions = readJson<SessionStore>(storageKey, {});
  writeJson(storageKey, {
    ...sessions,
    [session.sessionDate]: session,
  });
}

export function createDailySession(
  words: VocabularyWord[],
  sessionDate = getLocalDateKey(),
  packId = "ielts_core_v1",
): DailySession {
  const intensity = getLearningIntensity(packId);
  const config = INTENSITY_OPTIONS[intensity];
  const learningStates = getAllLearningStates();
  const extraSessionStore = readJson<
    Record<string, { items?: Array<{ wordId?: string }> }>
  >(EXTRA_SESSION_STORAGE_KEY, {});
  const extraSessionWordIds = new Set(
    Object.values(extraSessionStore).flatMap((session) =>
      (session.items ?? [])
        .map((item) => item.wordId)
        .filter((wordId): wordId is string => typeof wordId === "string"),
    ),
  );
  const reviewWords = words
    .filter((word) => learningStates[word.id]?.inReviewPool)
    .slice(0, config.reviewLimit);
  const newWords = words
    .filter(
      (word) =>
        !learningStates[word.id] && !extraSessionWordIds.has(word.id),
    )
    .slice(0, config.newWordTarget);

  const session: DailySession = {
    packId,
    sessionDate,
    intensity,
    items: [
      ...reviewWords.map((word) => ({
        wordId: word.id,
        word: word.word,
        type: "review" as const,
        todayMastered: false,
        dailyConsecutiveKnowCount: 0,
        wasUnknownToday: false,
      })),
      ...newWords.map((word) => ({
        wordId: word.id,
        word: word.word,
        type: "new" as const,
        todayMastered: false,
        dailyConsecutiveKnowCount: 0,
        wasUnknownToday: false,
      })),
    ],
    currentIndex: 0,
    startedAt: null,
    completed: false,
    completionTime: null,
  };

  saveDailySession(session);
  return session;
}

export function getOrCreateTodaySession(words: VocabularyWord[]): DailySession {
  const today = getLocalDateKey();
  return getDailySession(today) ?? createDailySession(words, today);
}

export function startDailySession(sessionDate: string): DailySession | null {
  const session = getDailySession(sessionDate);
  if (!session) return null;
  const nextSession = session.startedAt
    ? session
    : { ...session, startedAt: new Date().toISOString() };
  saveDailySession(nextSession);
  return nextSession;
}

export function updateSessionItem(
  sessionDate: string,
  wordId: string,
  todayMastered: boolean,
  currentIndex?: number,
  dailyConsecutiveKnowCount?: number,
  wasUnknownToday?: boolean,
): DailySession | null {
  const session = getDailySession(sessionDate);
  if (!session) return null;

  const items = session.items.map((item) =>
    item.wordId === wordId
      ? {
          ...item,
          todayMastered,
          dailyConsecutiveKnowCount:
            dailyConsecutiveKnowCount ?? item.dailyConsecutiveKnowCount,
          wasUnknownToday: wasUnknownToday ?? item.wasUnknownToday,
        }
      : item,
  );
  const nextSession: DailySession = {
    ...session,
    items,
    currentIndex: currentIndex ?? session.currentIndex,
  };
  saveDailySession(nextSession);
  return nextSession;
}

export function setSessionCurrentIndex(sessionDate: string, currentIndex: number): void {
  const session = getDailySession(sessionDate);
  if (!session) return;
  saveDailySession({ ...session, currentIndex });
}

export function getNextUnmasteredItemIndex(
  items: DailySessionItem[],
  currentIndex: number,
): number {
  const nextIndex = items.findIndex(
    (item, index) => index > currentIndex && !item.todayMastered,
  );
  if (nextIndex >= 0) return nextIndex;
  return items.findIndex((item) => !item.todayMastered);
}

function recordCheckIn(sessionDate: string): void {
  const developmentLearningTest = isDevelopmentLearningTestSession(sessionDate);
  const developmentSettlementTest = isDevelopmentSettlementTestSession(sessionDate);
  const storageKey = developmentLearningTest
    ? DEVELOPMENT_TEST_CHECK_IN_STORAGE_KEY
    : developmentSettlementTest
      ? DEVELOPMENT_SETTLEMENT_CHECK_IN_STORAGE_KEY
      : CHECK_IN_STORAGE_KEY;
  const checkInDate = developmentLearningTest
    ? getLocalDateKey()
    : developmentSettlementTest
      ? getDevelopmentSettlementDate(sessionDate)
      : sessionDate;
  const dates = readJson<string[]>(storageKey, []);
  if (!dates.includes(checkInDate)) {
    writeJson(storageKey, [...dates, checkInDate].sort());
  }
}

export function resetDevelopmentLearningTestSession(
  words: VocabularyWord[],
  includeReviewItem = false,
): DailySession | null {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return null;
  }

  const uniqueWords = [...new Map(words.map((word) => [word.id, word])).values()].slice(0, 4);
  if (uniqueWords.length !== 4) return null;

  const session: DailySession = {
    packId: "ielts_core_v1",
    sessionDate: DEVELOPMENT_TEST_SESSION_DATE,
    intensity: "light",
    items: uniqueWords.map((word, index) => ({
      wordId: word.id,
      word: word.word,
      type: includeReviewItem && index === 0 ? "review" : "new",
      todayMastered: false,
      dailyConsecutiveKnowCount: 0,
      wasUnknownToday: false,
    })),
    currentIndex: 0,
    startedAt: null,
    completed: false,
    completionTime: null,
  };

  writeJson(DEVELOPMENT_TEST_SESSION_STORAGE_KEY, {
    [DEVELOPMENT_TEST_SESSION_DATE]: session,
  });
  window.localStorage.removeItem(DEVELOPMENT_TEST_LEARNING_STATE_STORAGE_KEY);
  window.localStorage.removeItem(DEVELOPMENT_TEST_CHECK_IN_STORAGE_KEY);
  return session;
}

export function resetDevelopmentSettlementTest(): void {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.localStorage.removeItem(DEVELOPMENT_SETTLEMENT_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(DEVELOPMENT_SETTLEMENT_CHECK_IN_STORAGE_KEY);
}

export function seedDevelopmentSettlementSession(
  checkInDate: string,
): DailySession | null {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return null;
  }

  const sessionDate = `${DEVELOPMENT_SETTLEMENT_TEST_PREFIX}${checkInDate}`;
  const session: DailySession = {
    packId: "ielts_core_v1",
    sessionDate,
    intensity: "light",
    items: [
      {
        wordId: `settlement-${checkInDate}`,
        word: "settlement-test",
        type: "new",
        todayMastered: true,
        dailyConsecutiveKnowCount: 0,
        wasUnknownToday: false,
      },
    ],
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    completed: false,
    completionTime: null,
  };
  saveDailySession(session);
  return session;
}

export type CompleteDailySessionResult =
  | { status: "completed" | "already_completed"; session: DailySession }
  | { status: "not_found"; session: null }
  | { status: "not_ready"; session: DailySession };

export function completeDailySession(sessionDate: string): CompleteDailySessionResult {
  const session = getDailySession(sessionDate);
  if (!session) return { status: "not_found", session: null };
  if (session.completed) {
    recordCheckIn(session.sessionDate);
    return { status: "already_completed", session };
  }

  const allItemsMastered =
    session.items.length > 0 && session.items.every((item) => item.todayMastered);
  if (!allItemsMastered) return { status: "not_ready", session };

  const completedSession: DailySession = {
    ...session,
    completed: true,
    completionTime: new Date().toISOString(),
  };
  saveDailySession(completedSession);
  recordCheckIn(completedSession.sessionDate);
  return { status: "completed", session: completedSession };
}

function getCheckInSummaryFromStorage(storageKey: string, referenceDate: Date) {
  const dates = [...new Set(readJson<string[]>(storageKey, []))].sort();
  const completedDates = new Set(dates);
  const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  if (!completedDates.has(getLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let currentStreak = 0;
  while (completedDates.has(getLocalDateKey(cursor))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { currentStreak, totalCheckIns: dates.length };
}

export function getCheckInSummary(referenceDate = new Date()) {
  return getCheckInSummaryFromStorage(CHECK_IN_STORAGE_KEY, referenceDate);
}

export function ensureDevelopmentLearningTestSettlement(
  session: DailySession,
): void {
  if (
    isDevelopmentLearningTestSession(session.sessionDate) &&
    session.completed
  ) {
    recordCheckIn(session.sessionDate);
  }
}

export function getDevelopmentLearningTestCheckInSummary(
  referenceDate = new Date(),
) {
  return getCheckInSummaryFromStorage(
    DEVELOPMENT_TEST_CHECK_IN_STORAGE_KEY,
    referenceDate,
  );
}

export type DevelopmentSettlementDebugInfo = {
  checkInDates: string[];
  referenceDate: string;
  currentStreak: number;
  totalCheckIns: number;
};

export function getDevelopmentSettlementDebugInfo(
  referenceDate?: Date,
): DevelopmentSettlementDebugInfo {
  const dates = [...new Set(
    readJson<string[]>(DEVELOPMENT_SETTLEMENT_CHECK_IN_STORAGE_KEY, []),
  )].sort();
  const latestDate = dates.at(-1);
  const effectiveReferenceDate =
    referenceDate ??
    (latestDate
      ? new Date(
          Number(latestDate.slice(0, 4)),
          Number(latestDate.slice(5, 7)) - 1,
          Number(latestDate.slice(8, 10)),
        )
      : new Date());

  const summary = getCheckInSummaryFromStorage(
    DEVELOPMENT_SETTLEMENT_CHECK_IN_STORAGE_KEY,
    effectiveReferenceDate,
  );

  return {
    checkInDates: dates,
    referenceDate: getLocalDateKey(effectiveReferenceDate),
    ...summary,
  };
}

export function getDevelopmentSettlementCheckInSummary(referenceDate?: Date) {
  const { currentStreak, totalCheckIns } =
    getDevelopmentSettlementDebugInfo(referenceDate);
  return { currentStreak, totalCheckIns };
}

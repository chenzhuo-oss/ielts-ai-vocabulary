import {
  DEVELOPMENT_TEST_SESSION_DATE,
  type DailySessionItem,
} from "@/lib/daily-session";
import { getAllLearningStates } from "@/lib/learning-state";

export const EXTRA_SESSION_STORAGE_KEY = "ielts-ai-vocabulary:extra-sessions";
export const DEVELOPMENT_EXTRA_SESSION_STORAGE_KEY =
  "ielts-ai-vocabulary:development-extra-sessions";

const DEVELOPMENT_EXTRA_PREFIX = "development-extra:";

export type ExtraSession = {
  id: string;
  packId: string;
  sessionDate: string;
  items: DailySessionItem[];
  currentIndex: number;
  startedAt: string | null;
  completed: boolean;
  completionTime: string | null;
};

type ExtraSessionStore = Record<string, ExtraSession>;
type VocabularyWord = { id: string; word: string };

function readStore(storageKey: string): ExtraSessionStore {
  if (typeof window === "undefined") return {};
  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) return {};
    const parsed: unknown = JSON.parse(storedValue);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as ExtraSessionStore)
      : {};
  } catch (error) {
    console.warn("无法读取 Extra Session，将使用空状态", error);
    return {};
  }
}

function writeStore(storageKey: string, store: ExtraSessionStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(store));
}

export function isDevelopmentExtraSession(extraSessionId?: string): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    Boolean(extraSessionId?.startsWith(DEVELOPMENT_EXTRA_PREFIX))
  );
}

function getStorageKey(developmentTest: boolean): string {
  return process.env.NODE_ENV === "development" && developmentTest
    ? DEVELOPMENT_EXTRA_SESSION_STORAGE_KEY
    : EXTRA_SESSION_STORAGE_KEY;
}

export function getExtraSessionsForDate(
  sessionDate: string,
  developmentTest = false,
): ExtraSession[] {
  return Object.values(readStore(getStorageKey(developmentTest)))
    .filter((session) => session.sessionDate === sessionDate)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getExtraSession(extraSessionId: string): ExtraSession | null {
  const session =
    readStore(getStorageKey(isDevelopmentExtraSession(extraSessionId)))[
      extraSessionId
    ] ?? null;
  return session
    ? {
        ...session,
        packId: session.packId ?? "ielts_core_v1",
        items: session.items.map((item) => ({
          ...item,
          wasUnknownToday: item.wasUnknownToday ?? false,
        })),
      }
    : null;
}

export function saveExtraSession(session: ExtraSession): void {
  const storageKey = getStorageKey(isDevelopmentExtraSession(session.id));
  writeStore(storageKey, {
    ...readStore(storageKey),
    [session.id]: session,
  });
}

export function getAvailableExtraWords(
  words: VocabularyWord[],
  sessionDate: string,
  mainWordIds: string[],
  developmentTest = false,
): VocabularyWord[] {
  const extraWordIds = new Set(
    getExtraSessionsForDate(sessionDate, developmentTest).flatMap((session) =>
      session.items.map((item) => item.wordId),
    ),
  );
  const excludedWordIds = new Set([...mainWordIds, ...extraWordIds]);
  const learningStates = getAllLearningStates(developmentTest);

  const seenWordIds = new Set<string>();
  return words.filter((word) => {
    if (
      seenWordIds.has(word.id) ||
      excludedWordIds.has(word.id) ||
      learningStates[word.id]
    ) {
      return false;
    }
    seenWordIds.add(word.id);
    return true;
  });
}

export function createExtraSession(
  words: VocabularyWord[],
  sessionDate: string,
  mainWordIds: string[],
  developmentTest = false,
  packId = "ielts_core_v1",
): ExtraSession | null {
  const availableWords = getAvailableExtraWords(
    words,
    sessionDate,
    mainWordIds,
    developmentTest,
  ).slice(0, 5);
  if (availableWords.length === 0) return null;

  const existingSessions = getExtraSessionsForDate(sessionDate, developmentTest);
  const ordinal = existingSessions.length + 1;
  const prefix = developmentTest ? DEVELOPMENT_EXTRA_PREFIX : "extra:";
  const session: ExtraSession = {
    id: `${prefix}${sessionDate}:${ordinal}`,
    packId,
    sessionDate,
    items: availableWords.map((word) => ({
      wordId: word.id,
      word: word.word,
      type: "new",
      todayMastered: false,
      dailyConsecutiveKnowCount: 0,
      wasUnknownToday: false,
    })),
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    completed: false,
    completionTime: null,
  };
  saveExtraSession(session);
  return session;
}

export function startExtraSession(extraSessionId: string): ExtraSession | null {
  const session = getExtraSession(extraSessionId);
  if (!session) return null;
  const nextSession = session.startedAt
    ? session
    : { ...session, startedAt: new Date().toISOString() };
  saveExtraSession(nextSession);
  return nextSession;
}

export function updateExtraSessionItem(
  extraSessionId: string,
  wordId: string,
  todayMastered: boolean,
  currentIndex?: number,
  dailyConsecutiveKnowCount?: number,
  wasUnknownToday?: boolean,
): ExtraSession | null {
  const session = getExtraSession(extraSessionId);
  if (!session) return null;
  const nextSession: ExtraSession = {
    ...session,
    completed: false,
    completionTime: null,
    currentIndex: currentIndex ?? session.currentIndex,
    items: session.items.map((item) =>
      item.wordId === wordId
        ? {
            ...item,
            todayMastered,
            dailyConsecutiveKnowCount:
              dailyConsecutiveKnowCount ?? item.dailyConsecutiveKnowCount,
            wasUnknownToday: wasUnknownToday ?? item.wasUnknownToday,
          }
        : item,
    ),
  };
  saveExtraSession(nextSession);
  return nextSession;
}

export function setExtraSessionCurrentIndex(
  extraSessionId: string,
  currentIndex: number,
): void {
  const session = getExtraSession(extraSessionId);
  if (session) saveExtraSession({ ...session, currentIndex });
}

export function completeExtraSession(extraSessionId: string): ExtraSession | null {
  const session = getExtraSession(extraSessionId);
  if (!session) return null;
  if (session.completed) return session;
  if (!session.items.length || session.items.some((item) => !item.todayMastered)) {
    return session;
  }
  const completedSession = {
    ...session,
    completed: true,
    completionTime: new Date().toISOString(),
  };
  saveExtraSession(completedSession);
  return completedSession;
}

export function getExtraMasteredCount(
  sessionDate: string,
  developmentTest = false,
): number {
  const masteredWordIds = new Set<string>();
  getExtraSessionsForDate(sessionDate, developmentTest).forEach((session) => {
    session.items.forEach((item) => {
      if (item.todayMastered) masteredWordIds.add(item.wordId);
    });
  });
  return masteredWordIds.size;
}

export function getActiveExtraSession(
  sessionDate: string,
  developmentTest = false,
): ExtraSession | null {
  return (
    getExtraSessionsForDate(sessionDate, developmentTest).find(
      (session) => !session.completed,
    ) ?? null
  );
}

export function resetDevelopmentExtraSessions(): void {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(DEVELOPMENT_EXTRA_SESSION_STORAGE_KEY);
}

export function isDevelopmentMainSessionDate(sessionDate?: string): boolean {
  return sessionDate === DEVELOPMENT_TEST_SESSION_DATE;
}

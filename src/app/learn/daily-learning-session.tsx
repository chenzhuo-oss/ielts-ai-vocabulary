"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import vocabularyData from "@/data/vocabulary.json";
import {
  getDailySession,
  getLocalDateKey,
  getNextUnmasteredItemIndex,
  getOrCreateTodaySession,
  setSessionCurrentIndex,
  startDailySession,
  type DailySession,
} from "@/lib/daily-session";
import {
  completeExtraSession,
  getExtraSession,
  setExtraSessionCurrentIndex,
  startExtraSession,
  type ExtraSession,
} from "@/lib/extra-session";
import { DailyLearningCard } from "./daily-learning-card";
import { ExtraSessionComplete } from "./extra-session-complete";

type DailyLearningSessionProps = {
  rawIndex?: string;
  sessionDate?: string;
  sessionType: "main" | "extra";
  extraSessionId?: string;
};

export function DailyLearningSession({
  rawIndex,
  sessionDate,
  sessionType,
  extraSessionId,
}: DailyLearningSessionProps) {
  const router = useRouter();
  const [session, setSession] = useState<DailySession | ExtraSession | null>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      if (sessionType === "extra" && extraSessionId) {
        const storedExtraSession = getExtraSession(extraSessionId);
        setSession(
          storedExtraSession
            ? (startExtraSession(extraSessionId) ?? storedExtraSession)
            : null,
        );
        return;
      }
      const date = sessionDate ?? getLocalDateKey();
      const storedSession =
        getDailySession(date) ?? getOrCreateTodaySession(vocabularyData.words);
      setSession(startDailySession(storedSession.sessionDate) ?? storedSession);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [extraSessionId, sessionDate, sessionType]);

  const parsedIndex = Number.parseInt(
    rawIndex ?? String(session?.currentIndex ?? 0),
    10,
  );
  const requestedIndex =
    session &&
    Number.isInteger(parsedIndex) &&
    parsedIndex >= 0 &&
    parsedIndex < session.items.length
      ? parsedIndex
      : (session?.currentIndex ?? -1);
  const requestedItem = session?.items[requestedIndex];
  const currentIndex = session
    ? requestedItem && !requestedItem.todayMastered
      ? requestedIndex
      : getNextUnmasteredItemIndex(session.items, requestedIndex)
    : -1;
  const allItemsMastered = Boolean(
    session &&
      session.items.length > 0 &&
      session.items.every((item) => item.todayMastered),
  );

  useEffect(() => {
    if (!session) return;

    if (allItemsMastered) {
      if (sessionType === "extra" && extraSessionId) {
        if (!session.completed) {
          completeExtraSession(extraSessionId);
        }
      } else {
        router.replace(`/complete?sessionDate=${session.sessionDate}`);
      }
      return;
    }

    if (currentIndex >= 0 && currentIndex !== requestedIndex) {
      if (sessionType === "extra" && extraSessionId) {
        setExtraSessionCurrentIndex(extraSessionId, currentIndex);
      } else {
        setSessionCurrentIndex(session.sessionDate, currentIndex);
      }
      router.replace(
        sessionType === "extra" && extraSessionId
          ? `/learn?sessionType=extra&extraSessionId=${encodeURIComponent(extraSessionId)}&sessionDate=${encodeURIComponent(session.sessionDate)}&index=${currentIndex}`
          : `/learn?sessionDate=${session.sessionDate}&index=${currentIndex}`,
      );
    }
  }, [
    allItemsMastered,
    currentIndex,
    extraSessionId,
    requestedIndex,
    router,
    session,
    sessionType,
  ]);

  if (!session) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8">
        <p className="text-sm text-slate-500">正在恢复学习进度…</p>
      </main>
    );
  }

  if (allItemsMastered) {
    if (sessionType === "extra") {
      const masteredWordIds = new Set(
        session.items
          .filter((item) => item.todayMastered)
          .map((item) => item.wordId),
      );
      return (
        <ExtraSessionComplete
          masteredCount={masteredWordIds.size}
          total={new Set(session.items.map((item) => item.wordId)).size}
          sessionDate={session.sessionDate}
        />
      );
    }
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8">
        <p className="text-sm text-slate-500">正在进入今日学习完成页面…</p>
      </main>
    );
  }

  const currentItem = session.items[currentIndex];

  if (!currentItem) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8">
        <div className="rounded-xl border border-slate-200 p-6 text-center">
          <p className="text-slate-700">当前没有可学习的任务。</p>
          <Link href="/" className="mt-4 inline-block text-sm underline">返回首页</Link>
        </div>
      </main>
    );
  }

  const word = vocabularyData.words.find((entry) => entry.id === currentItem.wordId);
  if (!word) return null;

  const uniqueItems = Array.from(
    new Map(session.items.map((item) => [item.wordId, item])).values(),
  );
  const masteredCount = uniqueItems.filter((item) => item.todayMastered).length;
  const newItems = uniqueItems.filter((item) => item.type === "new");
  const newMasteredCount = newItems.filter((item) => item.todayMastered).length;
  const reviewItems = uniqueItems.filter((item) => item.type === "review");
  const reviewMasteredCount = reviewItems.filter((item) => item.todayMastered).length;

  const learningCard = (
    <DailyLearningCard
      word={{ id: word.id, word: word.word, phonetic: word.phonetic }}
      itemType={currentItem.type}
      sessionDate={session.sessionDate}
      sessionType={sessionType}
      extraSessionId={extraSessionId}
      currentIndex={currentIndex}
      dailyConsecutiveKnowCount={currentItem.dailyConsecutiveKnowCount}
      wasUnknownToday={currentItem.wasUnknownToday}
      progress={{
        total: { current: masteredCount, total: uniqueItems.length },
        newWords: {
          current: newMasteredCount,
          total: newItems.length,
        },
        review: {
          current: reviewMasteredCount,
          total: reviewItems.length,
        },
      }}
    />
  );

  return learningCard;
}

"use client";

import { useEffect, useState } from "react";
import { AppLink } from "@/components/navigation/app-link";
import {
  getDailySession,
  getNextUnmasteredItemIndex,
  isDevelopmentLearningTestSession,
  setSessionCurrentIndex,
  updateSessionItem,
  type DailySession,
} from "@/lib/daily-session";
import {
  completeExtraSession,
  getExtraSession,
  isDevelopmentExtraSession,
  setExtraSessionCurrentIndex,
  updateExtraSessionItem,
  type ExtraSession,
} from "@/lib/extra-session";
import {
  getLearningState,
  saveLearningState,
  type LearningState,
} from "@/lib/learning-state";

type WordLearningControlsProps =
  | {
      wordId: string;
      mode: "status";
      sessionDate?: string;
      sessionType: "main" | "extra";
      extraSessionId?: string;
    }
  | {
      wordId: string;
      mode: "navigation";
      sessionDate?: string;
      sessionType: "main" | "extra";
      extraSessionId?: string;
      currentItemIndex: number;
      className?: string;
    };

export function WordLearningControls(props: WordLearningControlsProps) {
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [learningSession, setLearningSession] = useState<
    DailySession | ExtraSession | null
  >(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setLearningState(
        getLearningState(
          props.wordId,
          isDevelopmentLearningTestSession(props.sessionDate) ||
            isDevelopmentExtraSession(props.extraSessionId),
        ),
      );
      if (props.sessionType === "extra" && props.extraSessionId) {
        setLearningSession(getExtraSession(props.extraSessionId));
      } else if (props.sessionDate) {
        setLearningSession(getDailySession(props.sessionDate));
      }
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [
    props.extraSessionId,
    props.sessionDate,
    props.sessionType,
    props.wordId,
  ]);

  if (props.mode === "navigation") {
    if (
      props.currentItemIndex < 0 ||
      !props.sessionDate ||
      !learningSession
    ) {
      return null;
    }

    const allItemsMastered =
      learningSession.items.length > 0 &&
      learningSession.items.every((item) => item.todayMastered);
    const nextIndex = Math.max(
      0,
      getNextUnmasteredItemIndex(learningSession.items, props.currentItemIndex),
    );
    const extraSession =
      props.sessionType === "extra" && props.extraSessionId;
    const href = extraSession
      ? allItemsMastered
        ? `/learn?sessionType=extra&extraSessionId=${encodeURIComponent(props.extraSessionId!)}&sessionDate=${encodeURIComponent(props.sessionDate)}&index=${props.currentItemIndex}`
        : `/learn?sessionType=extra&extraSessionId=${encodeURIComponent(props.extraSessionId!)}&sessionDate=${encodeURIComponent(props.sessionDate)}&index=${nextIndex}`
      : allItemsMastered
        ? `/complete?sessionDate=${props.sessionDate}`
        : `/learn?sessionDate=${props.sessionDate}&index=${nextIndex}`;

    return (
      <AppLink
        href={href}
        intent={allItemsMastered ? "flow-completion" : "forward"}
        source="word-detail-learning"
        fallback="/"
        onClick={() => {
          if (extraSession && allItemsMastered) {
            completeExtraSession(props.extraSessionId!);
          } else if (extraSession) {
            setExtraSessionCurrentIndex(props.extraSessionId!, nextIndex);
          } else if (!allItemsMastered) {
            setSessionCurrentIndex(props.sessionDate!, nextIndex);
          }
        }}
        className={props.className ?? "block w-full rounded-xl bg-slate-900 px-5 py-3 text-center font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"}
      >
        {allItemsMastered
          ? extraSession
            ? "完成额外学习"
            : "完成今日学习"
          : "下一个单词"}
      </AppLink>
    );
  }

  function restartLearning() {
    const nextState: LearningState = {
      wordId: props.wordId,
      status: "unknown",
      inReviewPool: true,
      todayMastered: false,
      dailyConsecutiveKnowCount: 0,
      firstLearningCompleted: learningState?.firstLearningCompleted ?? false,
      updatedAt: new Date().toISOString(),
    };

    saveLearningState(
      nextState,
      isDevelopmentLearningTestSession(props.sessionDate) ||
        isDevelopmentExtraSession(props.extraSessionId),
    );
    if (props.sessionType === "extra" && props.extraSessionId) {
      updateExtraSessionItem(props.extraSessionId, props.wordId, false, undefined, 0, true);
    } else if (props.sessionDate) {
      updateSessionItem(props.sessionDate, props.wordId, false, undefined, 0, true);
    }
    setLearningState(nextState);
  }

  const statusLabel = !hasLoaded
    ? "读取中"
    : learningState?.status === "know"
      ? "认识"
      : learningState?.status === "unknown"
        ? "不认识"
        : "尚未判断";

  return (
    <section aria-label="当前学习状态" className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
        {statusLabel}
      </span>
      {learningState?.status === "know" && (
        <button
          type="button"
          onClick={restartLearning}
          className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          重新学习
        </button>
      )}
    </section>
  );
}

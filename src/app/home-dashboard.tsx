"use client";

import Image from "next/image";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import homeGoose from "@/assets/home-goose-wave-v2.png";
import packStageComplete from "@/assets/home-pack-stage-complete.svg";
import vocabularyData from "@/data/vocabulary.json";
import { getStreakStageProgress } from "./streak-progress";
import styles from "./home-dashboard.module.css";
import {
  ensureDevelopmentLearningTestSettlement,
  getCheckInSummary,
  getDailySession,
  getDevelopmentLearningTestCheckInSummary,
  getOrCreateTodaySession,
  getSessionSummary,
  isDevelopmentLearningTestSession,
  setSessionCurrentIndex,
  startDailySession,
  type DailySession,
} from "@/lib/daily-session";
import {
  createExtraSession,
  getActiveExtraSession,
  getAvailableExtraWords,
  getExtraMasteredCount,
  setExtraSessionCurrentIndex,
  startExtraSession,
  type ExtraSession,
} from "@/lib/extra-session";
import {
  DEFAULT_PACK_ID,
  getCurrentPackId,
  getPackProgress,
  getVocabularyPack,
} from "@/lib/vocabulary-packs";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 6) return "夜深了！";
  if (hour < 12) return "早上好！";
  if (hour < 18) return "下午好！";
  return "晚上好！";
}

function formatWelcomeDate(sessionDate: string): string {
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(sessionDate)
    ? new Date(`${sessionDate}T00:00:00`)
    : new Date();
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format(parsedDate)
    .toUpperCase();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" })
    .format(parsedDate)
    .toUpperCase();
  return `${day} ${month} · ${weekday}`;
}

function StreakNodes({ progress }: { progress: number }) {
  return (
    <div className={styles.streakNodes} aria-label={`本阶段 ${progress} / 7`}>
      {Array.from({ length: 7 }, (_, index) => {
        const stage = index + 1;
        const completed = progress > 0 && stage < progress;
        const current = progress > 0 && stage === progress;
        return (
          <span
            key={stage}
            className={`${styles.streakNode} ${completed ? styles.streakNodeCompleted : ""} ${current ? styles.streakNodeCurrent : ""}`}
            aria-label={
              completed
                ? `第 ${stage} 个阶段节点已完成`
                : current
                  ? `当前为第 ${stage} 个阶段节点`
                  : `第 ${stage} 个阶段节点未完成`
            }
          />
        );
      })}
    </div>
  );
}

function CurrentPackSummary({
  packName,
  learnedWordCount,
  totalWordCount,
  onOpen,
}: {
  packName: string;
  learnedWordCount: number;
  totalWordCount: number;
  onOpen: () => void;
}) {
  return (
    <button type="button" className={styles.packSummary} onClick={onOpen}>
      <span className={styles.packName}>{packName}</span>
      <span className={styles.packCount}>
        {learnedWordCount} / {totalWordCount}
      </span>
      <span className={styles.packArrow} aria-hidden="true" />
    </button>
  );
}

export function HomeDashboard({
  requestedSessionDate,
}: {
  requestedSessionDate?: string;
}) {
  const router = useRouter();
  const [session, setSession] = useState<DailySession | null>(null);
  const [checkIns, setCheckIns] = useState({ currentStreak: 0, totalCheckIns: 0 });
  const [extraMastered, setExtraMastered] = useState(0);
  const [activeExtraSession, setActiveExtraSession] =
    useState<ExtraSession | null>(null);
  const [hasAvailableExtraWords, setHasAvailableExtraWords] = useState(false);
  const [packProgress, setPackProgress] = useState({
    learnedWordCount: 0,
    totalWordCount: 0,
    reviewPoolCount: 0,
  });

  const refreshHomeState = useCallback(() => {
    const developmentTest = isDevelopmentLearningTestSession(requestedSessionDate);
    const nextSession = requestedSessionDate
      ? getDailySession(requestedSessionDate)
      : getOrCreateTodaySession(vocabularyData.words);
    if (!nextSession) return;
    if (developmentTest) ensureDevelopmentLearningTestSettlement(nextSession);

    const currentPackId = getCurrentPackId();
    const progress = getPackProgress(currentPackId, developmentTest);

    setSession(nextSession);
    setPackProgress({
      ...progress,
    });
    setExtraMastered(
      getExtraMasteredCount(nextSession.sessionDate, developmentTest),
    );
    setActiveExtraSession(
      getActiveExtraSession(nextSession.sessionDate, developmentTest),
    );
    setHasAvailableExtraWords(
      getAvailableExtraWords(
        vocabularyData.words,
        nextSession.sessionDate,
        nextSession.items.map((item) => item.wordId),
        developmentTest,
      ).length > 0,
    );
    setCheckIns(
      developmentTest
        ? getDevelopmentLearningTestCheckInSummary()
        : getCheckInSummary(),
    );
  }, [requestedSessionDate]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      refreshHomeState();
    }, 0);
    window.addEventListener("pageshow", refreshHomeState);
    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener("pageshow", refreshHomeState);
    };
  }, [refreshHomeState]);

  function enterSession() {
    if (!session) return;
    const startedSession = startDailySession(session.sessionDate) ?? session;
    const currentItem = startedSession.items[startedSession.currentIndex];
    const nextUnfinishedIndex = currentItem?.todayMastered
      ? startedSession.items.findIndex(
          (item, index) =>
            index > startedSession.currentIndex && !item.todayMastered,
        )
      : startedSession.currentIndex;
    const resumeIndex =
      nextUnfinishedIndex >= 0
        ? nextUnfinishedIndex
        : Math.max(
            0,
            startedSession.items.findIndex((item) => !item.todayMastered),
          );
    setSessionCurrentIndex(startedSession.sessionDate, resumeIndex);
    setSession({ ...startedSession, currentIndex: resumeIndex });
    router.push(
      `/learn?sessionDate=${startedSession.sessionDate}&index=${resumeIndex}`,
    );
  }

  function enterExtraSession() {
    if (!session) return;
    const developmentTest = isDevelopmentLearningTestSession(session.sessionDate);
    const extraSession =
      activeExtraSession ??
      createExtraSession(
        vocabularyData.words,
        session.sessionDate,
        session.items.map((item) => item.wordId),
        developmentTest,
      );
    if (!extraSession) return;
    const startedSession = startExtraSession(extraSession.id) ?? extraSession;
    const currentItem = startedSession.items[startedSession.currentIndex];
    const nextIndex = currentItem?.todayMastered
      ? startedSession.items.findIndex((item) => !item.todayMastered)
      : startedSession.currentIndex;
    const resumeIndex = Math.max(0, nextIndex);
    setExtraSessionCurrentIndex(startedSession.id, resumeIndex);
    setActiveExtraSession({ ...startedSession, currentIndex: resumeIndex });
    router.push(
      `/learn?sessionType=extra&extraSessionId=${encodeURIComponent(startedSession.id)}&sessionDate=${encodeURIComponent(startedSession.sessionDate)}&index=${resumeIndex}`,
    );
  }

  if (!session) {
    return (
      <main className={styles.loading}>
        <p>正在准备今日学习…</p>
      </main>
    );
  }

  const summary = getSessionSummary(session);
  const currentPackId = session.packId || getCurrentPackId() || DEFAULT_PACK_ID;
  const currentPack = getVocabularyPack(currentPackId);
  const stageProgress = getStreakStageProgress(checkIns.currentStreak);
  const remainingNew = summary.newTotal - summary.newMastered;
  const remainingReview = summary.reviewTotal - summary.reviewMastered;
  const todayTotalMastered = summary.mastered + extraMastered;
  const canEnterExtraSession = Boolean(
    activeExtraSession || hasAvailableExtraWords,
  );
  const packStageCompleted = Boolean(
    summary.status === "completed" &&
      packProgress.totalWordCount > 0 &&
      packProgress.learnedWordCount === packProgress.totalWordCount &&
      packProgress.reviewPoolCount === 0,
  );
  const progressSegments = [
    { label: "已掌握", value: summary.mastered, className: styles.mastered },
    { label: "待学新词", value: remainingNew, className: styles.pendingNew },
    {
      label: "待复习",
      value: remainingReview,
      className: styles.pendingReview,
    },
  ];

  return (
    <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
      <div className={styles.canvas}>
        <header className={styles.welcome}>
          <span className={styles.dateSticker}>
            {formatWelcomeDate(session.sessionDate)}
          </span>
          <div className={styles.welcomeCopy}>
            <h1>{getGreeting()}</h1>
            <p>今天也继续学一点吧</p>
          </div>
          <span className={styles.motivationSticker}>LET&apos;S GO</span>
          <Image
            src={homeGoose}
            alt="挥手并趴在连续学习卡片上的黑鹅"
            className={styles.homeGoose}
            priority
          />
        </header>

        <section className={styles.streakCard} aria-labelledby="streak-heading">
          <div className={styles.streakValue}>
            <strong id="streak-heading">{checkIns.currentStreak}</strong>
            <span className={styles.streakUnit}>天</span>
            <span className={styles.streakDescription}>连续学习</span>
          </div>
          <span className={styles.totalCheckIns}>
            累计打卡{checkIns.totalCheckIns}天
          </span>
          <StreakNodes progress={stageProgress} />
          <span className={styles.stageProgress}>本阶段 {stageProgress}/7</span>
        </section>

        <section
          className={`${styles.todaySection} ${packStageCompleted ? styles.todaySectionStageComplete : ""}`}
          aria-labelledby="today-heading"
        >
          <div className={styles.todayHeadingRow}>
            <span className={styles.todaySticker}>TODAY</span>
            <h2 id="today-heading">
              {summary.status === "completed" ? "今日计划已完成" : "今日学习"}
            </h2>
          </div>

          {packStageCompleted ? (
            <button
              type="button"
              className={styles.packStageCompletion}
              onClick={() => router.push(`/packs/${currentPackId}`)}
            >
              <span className={styles.packStageCopy}>
                <span className={styles.packStageSticker}>词包阶段完成</span>
                <strong>当前词包的新词已全部学完</strong>
                <span className={styles.packStageDescription}>
                  {packProgress.totalWordCount} 个核心词 · 已完成首次学习
                </span>
              </span>
              <Image
                src={packStageComplete}
                alt=""
                aria-hidden="true"
                className={styles.packStageIcon}
              />
              <span className={styles.packStageArrow} aria-hidden="true" />
            </button>
          ) : (
            <CurrentPackSummary
              packName={currentPack?.name ?? "IELTS 核心单词"}
              learnedWordCount={packProgress.learnedWordCount}
              totalWordCount={packProgress.totalWordCount}
              onOpen={() => router.push(`/packs/${currentPackId}`)}
            />
          )}

          <div className={styles.progressSummary}>
            <strong>{summary.mastered}</strong>
            <span className={styles.progressTotal}>/ {summary.total}</span>
            <span className={styles.progressDescription}>
              {summary.status === "completed"
                ? "主计划"
                : `已掌握 · 还剩${summary.remaining}`}
            </span>
          </div>

          <div className={styles.progressBar} aria-label="今日学习分段进度">
            {progressSegments.map((segment) =>
              segment.value > 0 ? (
                <span
                  key={segment.label}
                  className={segment.className}
                  style={{ flexGrow: segment.value }}
                  title={`${segment.label} ${segment.value}`}
                />
              ) : null,
            )}
          </div>

          {summary.status === "completed" ? (
            <div className={styles.completedSummary}>
              <strong>今日总掌握 {todayTotalMastered} 个</strong>
              {extraMastered > 0 && (
                <span className={styles.extraBadge}>
                  额外学习 {extraMastered} 个
                </span>
              )}
            </div>
          ) : (
            <div className={styles.progressLegend}>
              <span className={styles.newChip}>新词 {remainingNew}</span>
              <span className={styles.reviewChip}>复习 {remainingReview}</span>
            </div>
          )}

          {summary.status === "completed" ? (
            !packStageCompleted && canEnterExtraSession && (
              <button
                type="button"
                onClick={enterExtraSession}
                className={styles.primaryCta}
              >
                <span aria-hidden="true" />
                {activeExtraSession ? "继续额外学习" : "再学一组"}
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={enterSession}
              className={styles.primaryCta}
            >
              <span aria-hidden="true" />
              {summary.status === "not_started"
                ? "开始今日学习"
                : "继续今日学习"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

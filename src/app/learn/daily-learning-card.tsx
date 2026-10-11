"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WordDetailActions } from "@/app/words/[word]/word-detail-actions";
import learningGoose from "@/assets/daily-learning-goose-desk-v1.png";
import {
  isDevelopmentLearningTestSession,
  updateSessionItem,
} from "@/lib/daily-session";
import {
  isDevelopmentExtraSession,
  updateExtraSessionItem,
} from "@/lib/extra-session";
import {
  getLearningOutcome,
  getLearningState,
  saveLearningState,
  type LearningStatus,
} from "@/lib/learning-state";
import styles from "./daily-learning.module.css";

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

type DailyLearningCardProps = {
  word: { id: string; word: string; phonetic: string };
  itemType: "new" | "review";
  sessionDate: string;
  sessionType: "main" | "extra";
  extraSessionId?: string;
  currentIndex: number;
  dailyConsecutiveKnowCount: number;
  wasUnknownToday: boolean;
  progress: {
    total: { current: number; total: number };
    newWords: { current: number; total: number };
    review: { current: number; total: number };
  };
};

export function DailyLearningCard({
  word,
  itemType,
  sessionDate,
  sessionType,
  extraSessionId,
  currentIndex,
  dailyConsecutiveKnowCount,
  wasUnknownToday,
  progress,
}: DailyLearningCardProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  function selectStatus(status: LearningStatus) {
    if (saving) return;
    setSaving(true);
    const developmentTest =
      isDevelopmentLearningTestSession(sessionDate) ||
      isDevelopmentExtraSession(extraSessionId);
    const previousState = getLearningState(word.id, developmentTest);
    const outcome = getLearningOutcome({
      itemType,
      status,
      previousState,
      dailyConsecutiveKnowCount,
      wasUnknownToday,
    });
    saveLearningState(
      {
        wordId: word.id,
        status: outcome.status,
        inReviewPool: outcome.inReviewPool,
        todayMastered: outcome.todayMastered,
        dailyConsecutiveKnowCount: outcome.dailyConsecutiveKnowCount,
        firstLearningCompleted:
          previousState?.firstLearningCompleted === true ||
          (itemType === "new" && outcome.todayMastered),
        updatedAt: new Date().toISOString(),
      },
      developmentTest,
    );
    if (sessionType === "extra" && extraSessionId) {
      updateExtraSessionItem(
        extraSessionId,
        word.id,
        outcome.todayMastered,
        currentIndex,
        outcome.dailyConsecutiveKnowCount,
        outcome.wasUnknownToday,
      );
    } else {
      updateSessionItem(
        sessionDate,
        word.id,
        outcome.todayMastered,
        currentIndex,
        outcome.dailyConsecutiveKnowCount,
        outcome.wasUnknownToday,
      );
    }
    const sessionQuery =
      sessionType === "extra" && extraSessionId
        ? `sessionType=extra&extraSessionId=${encodeURIComponent(extraSessionId)}&sessionDate=${encodeURIComponent(sessionDate)}`
        : `sessionDate=${encodeURIComponent(sessionDate)}`;
    router.push(
      `/words/${encodeURIComponent(word.word)}?${sessionQuery}&index=${currentIndex}`,
    );
  }

  {
    const remainingNew = progress.newWords.total - progress.newWords.current;
    const remainingReview = progress.review.total - progress.review.current;
    const progressSegments = [
      {
        label: "已掌握",
        value: progress.total.current,
        className: styles.mastered,
      },
      {
        label: "待学新词",
        value: remainingNew,
        className: styles.pendingNew,
      },
      ...(sessionType === "main" ? [{
        label: "待复习",
        value: remainingReview,
        className: styles.pendingReview,
      }] : []),
    ].filter((segment) => segment.value > 0);

    return (
      <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
        <div className={styles.canvas}>
          <Link
            href={
              isDevelopmentLearningTestSession(sessionDate)
                ? `/?sessionDate=${encodeURIComponent(sessionDate)}`
                : "/"
            }
            className={styles.backButton}
            aria-label="返回首页"
          >
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 9H2" />
              <path d="m7 3.5-5.5 5.5L7 14.5" />
            </svg>
          </Link>

          <div className={styles.progressArea}>
            <div className={styles.progressMeta} aria-label="已掌握进度">
              <span className={styles.progressLabel}>已掌握</span>
              <strong className={styles.progressNumbers}>
                {progress.total.current} / {progress.total.total}
              </strong>
            </div>
            <div className={styles.progressBar} aria-hidden="true">
              {progressSegments.map((segment) => (
                <span
                  key={segment.label}
                  className={`${styles.progressSegment} ${segment.className}`}
                  style={{ flexGrow: segment.value, flexBasis: 0 }}
                />
              ))}
            </div>
          </div>

          <span
            className={`${styles.itemTag} ${sessionType === "extra" ? styles.extraTag : itemType === "new" ? styles.newTag : styles.reviewTag}`}
          >
            {sessionType === "extra"
              ? "额外学习"
              : itemType === "new"
                ? "新词"
                : "复习"}
          </span>

          <section className={styles.wordArea} aria-labelledby="current-word">
            <h1 id="current-word" className={styles.word} lang="en">
              {word.word}
            </h1>
            <div className={styles.phoneticRow}>
              <p className={styles.phonetic} lang="en">
                {word.phonetic}
              </p>
              <div className={styles.pronunciationButton}>
                <WordDetailActions word={word.word} variant="pronunciation" />
              </div>
            </div>
          </section>

          <span
            className={`${styles.wordAccent} ${itemType === "new" ? styles.newAccent : styles.reviewAccent}`}
            aria-hidden="true"
          />
          <p className={styles.helperText}>先凭第一感觉判断</p>

          <Image
            src={learningGoose}
            alt="坐在小书桌前学习的黑鹅"
            className={`${styles.learningGoose} ${sessionType === "extra" ? styles.extraLearningGoose : ""}`}
            priority
          />

          <section className={styles.judgmentArea} aria-labelledby="judgment-question">
            <h2 id="judgment-question" className={styles.question}>
              你认识这个单词吗？
            </h2>
            <div className={styles.judgmentButtons}>
              <button
                type="button"
                disabled={saving}
                onClick={() => selectStatus("unknown")}
                className={styles.judgmentButton}
              >
                不认识
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => selectStatus("know")}
                className={styles.judgmentButton}
              >
                认识
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }
}

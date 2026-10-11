"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import markUnknownArrow from "@/assets/word-detail-mark-unknown-arrow.svg";
import { getDailySession, isDevelopmentLearningTestSession, updateSessionItem, type DailySession } from "@/lib/daily-session";
import { getExtraSession, isDevelopmentExtraSession, updateExtraSessionItem, type ExtraSession } from "@/lib/extra-session";
import { getLearningState, saveLearningState, type LearningState } from "@/lib/learning-state";
import { WordDetailActions } from "./word-detail-actions";
import styles from "./word-detail.module.css";

type Props = {
  wordId: string;
  word: string;
  phonetic: string;
  backHref: string;
  sessionDate?: string;
  sessionType: "main" | "extra";
  extraSessionId?: string;
  mode?: "learning" | "browse";
};

export function WordDetailHeader(props: Props) {
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [session, setSession] = useState<DailySession | ExtraSession | null>(null);

  useEffect(() => {
    if (props.mode === "browse") return;
    const timer = window.setTimeout(() => {
      const development = isDevelopmentLearningTestSession(props.sessionDate) || isDevelopmentExtraSession(props.extraSessionId);
      setLearningState(getLearningState(props.wordId, development));
      setSession(
        props.sessionType === "extra" && props.extraSessionId
          ? getExtraSession(props.extraSessionId)
          : props.sessionDate ? getDailySession(props.sessionDate) : null,
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [props.extraSessionId, props.mode, props.sessionDate, props.sessionType, props.wordId]);

  function markUnknown() {
    const nextState: LearningState = {
      wordId: props.wordId,
      status: "unknown",
      inReviewPool: true,
      todayMastered: false,
      dailyConsecutiveKnowCount: 0,
      firstLearningCompleted: learningState?.firstLearningCompleted ?? false,
      updatedAt: new Date().toISOString(),
    };
    const development = isDevelopmentLearningTestSession(props.sessionDate) || isDevelopmentExtraSession(props.extraSessionId);
    saveLearningState(nextState, development);
    if (props.sessionType === "extra" && props.extraSessionId) {
      updateExtraSessionItem(props.extraSessionId, props.wordId, false, undefined, 0, true);
      setSession(getExtraSession(props.extraSessionId));
    } else if (props.sessionDate) {
      updateSessionItem(props.sessionDate, props.wordId, false, undefined, 0, true);
      setSession(getDailySession(props.sessionDate));
    }
    setLearningState(nextState);
  }

  const total = session?.items.length ?? 0;
  const mastered = session?.items.filter((item) => item.todayMastered).length ?? 0;
  const pendingNew = session?.items.filter((item) => item.type === "new" && !item.todayMastered).length ?? 0;
  const pendingReview = session?.items.filter((item) => item.type === "review" && !item.todayMastered).length ?? 0;
  const segments = [
    { label: "已掌握", value: mastered, className: styles.mastered },
    { label: "待学新词", value: pendingNew, className: styles.pendingNew },
    { label: "待复习", value: pendingReview, className: styles.pendingReview },
  ].filter((segment) => segment.value > 0);
  const unknown = learningState?.status === "unknown";

  if (props.mode === "browse") {
    return (
      <header className={`${styles.header} ${styles.browseHeader}`}>
        <Link href={props.backHref} className={styles.backButton} aria-label="返回词表">
          <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 9H2" /><path d="m7 3.5-5.5 5.5L7 14.5" />
          </svg>
        </Link>
        <span className={styles.browseModeTag}>浏览模式</span>
        <div className={styles.wordHeader}>
          <div><h1 lang="en">{props.word}</h1></div>
          <div className={styles.phoneticRow}>
            <p lang="en">{props.phonetic}</p>
            <div className={styles.speakerButton}><WordDetailActions word={props.word} variant="pronunciation" /></div>
          </div>
          <span className={styles.wordAccent} aria-hidden="true" />
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <Link href={props.backHref} className={styles.backButton} aria-label="返回学习页">
        <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 9H2" /><path d="m7 3.5-5.5 5.5L7 14.5" />
        </svg>
      </Link>
      <div className={styles.progressArea}>
        <div className={styles.progressMeta} aria-label={`已掌握 ${mastered} / ${total}`}>
          <span>已掌握</span><strong>{mastered} / {total}</strong>
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          {segments.map((segment) => (
            <span key={segment.label} className={`${styles.progressSegment} ${segment.className}`} style={{ flexGrow: segment.value, flexBasis: 0 }} />
          ))}
        </div>
      </div>
      <div className={styles.wordHeader}>
        <div className={unknown ? styles.wordMarker : undefined}><h1 lang="en">{props.word}</h1></div>
        <div className={styles.phoneticRow}>
          <p lang="en">{props.phonetic}</p>
          <div className={styles.speakerButton}><WordDetailActions word={props.word} variant="pronunciation" /></div>
        </div>
        <span className={styles.wordAccent} aria-hidden="true" />
      </div>
      {learningState?.status === "know" && (
        <button type="button" onClick={markUnknown} className={styles.markUnknown}>
          <Image src={markUnknownArrow} alt="" className={styles.markUnknownIcon} />
          不认识
        </button>
      )}
    </header>
  );
}

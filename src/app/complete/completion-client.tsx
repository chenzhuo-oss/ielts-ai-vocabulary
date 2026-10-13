"use client";

import Image from "next/image";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useEffect, useState } from "react";
import { AppLink } from "@/components/navigation/app-link";
import celebrationGoose from "@/assets/completion-goose-celebration-v1.png";
import ctaAccent from "@/assets/completion-cta-accent.svg";
import {
  completeDailySession,
  getDevelopmentLearningTestCheckInSummary,
  getDevelopmentSettlementCheckInSummary,
  getCheckInSummary,
  getLocalDateKey,
  isDevelopmentLearningTestSession,
  isDevelopmentSettlementTestSession,
  type CompleteDailySessionResult,
  type DailySessionItem,
} from "@/lib/daily-session";
import styles from "./completion.module.css";

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

type CompletionViewState = {
  result: CompleteDailySessionResult;
  currentStreak: number;
  totalCheckIns: number;
};

function getUniqueItems(items: DailySessionItem[]): DailySessionItem[] {
  return [...new Map(items.map((item) => [item.wordId, item])).values()];
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
      <section className={styles.emptyState}>
        <h1>{title}</h1>
        <p>{description}</p>
        <AppLink href={href} intent="back" source="completion" fallback="/" className={styles.primaryButton}>
          <Image src={ctaAccent} alt="" aria-hidden="true" />
          <span>{action}</span>
        </AppLink>
      </section>
    </main>
  );
}

export function CompletionClient({ sessionDate }: { sessionDate?: string }) {
  const [viewState, setViewState] = useState<CompletionViewState | null>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const result = completeDailySession(sessionDate ?? getLocalDateKey());
      const checkIns = isDevelopmentLearningTestSession(sessionDate)
        ? getDevelopmentLearningTestCheckInSummary()
        : isDevelopmentSettlementTestSession(sessionDate)
          ? getDevelopmentSettlementCheckInSummary()
          : getCheckInSummary();
      setViewState({ result, ...checkIns });
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [sessionDate]);

  if (!viewState) {
    return (
      <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
        <p className={styles.loading}>正在确认学习进度…</p>
      </main>
    );
  }

  const { result } = viewState;
  if (result.status === "not_found") {
    return (
      <EmptyState
        title="未找到今日学习任务"
        description="请先返回首页生成今日学习计划。"
        href="/"
        action="返回首页"
      />
    );
  }

  if (result.status === "not_ready") {
    const firstUnfinishedIndex = result.session.items.findIndex(
      (item) => !item.todayMastered,
    );
    return (
      <EmptyState
        title="今日学习尚未完成"
        description="完成全部新词和复习词后，才能进行今日结算。"
        href={`/learn?sessionDate=${encodeURIComponent(result.session.sessionDate)}&index=${Math.max(0, firstUnfinishedIndex)}`}
        action="继续今日学习"
      />
    );
  }

  const uniqueItems = getUniqueItems(result.session.items);
  const masteredCount = uniqueItems.filter((item) => item.todayMastered).length;
  const newCount = uniqueItems.filter((item) => item.type === "new").length;
  const reviewCount = uniqueItems.filter((item) => item.type === "review").length;
  const homeHref = isDevelopmentLearningTestSession(result.session.sessionDate)
    ? `/?sessionDate=${encodeURIComponent(result.session.sessionDate)}`
    : "/";

  return (
    <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
      <div className={styles.canvas}>
        <span className={styles.doneSticker}>TODAY DONE</span>

        <header className={styles.heading}>
          <h1>今日学习完成</h1>
          <p>今天也顺利完成了。</p>
        </header>

        <Image
          src={celebrationGoose}
          alt="戴着派对帽、张开翅膀庆祝的黑鹅"
          className={styles.celebrationGoose}
          priority
        />

        <section className={styles.masterySummary} aria-label="今日主计划掌握统计">
          <div className={styles.masteryValue}>
            <strong>{masteredCount}</strong>
            <span>今日掌握</span>
          </div>
          <div className={styles.itemChips}>
            <span className={styles.newChip}>新词 {newCount}</span>
            <span className={styles.reviewChip}>复习 {reviewCount}</span>
          </div>
        </section>

        <section className={styles.longTermStats} aria-label="长期学习统计">
          <div className={styles.metric}>
            <span>连续学习</span>
            <strong>{viewState.currentStreak} 天</strong>
          </div>
          <div className={styles.metric}>
            <span>累计打卡</span>
            <strong>{viewState.totalCheckIns} 天</strong>
          </div>
        </section>

        <AppLink
          href={homeHref}
          intent="flow-completion"
          source="completion"
          fallback="/"
          className={styles.backHomeButton}
        >
          <Image src={ctaAccent} alt="" aria-hidden="true" />
          <span>返回首页</span>
        </AppLink>
      </div>
    </main>
  );
}

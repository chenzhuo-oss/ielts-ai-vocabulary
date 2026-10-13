"use client";

import Image from "next/image";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { AppLink } from "@/components/navigation/app-link";
import celebrationGoose from "@/assets/completion-goose-celebration-v1.png";
import ctaAccent from "@/assets/completion-cta-accent.svg";
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

type ExtraSessionCompleteProps = {
  masteredCount: number;
  total: number;
  sessionDate: string;
};

export function ExtraSessionComplete({
  masteredCount,
  total,
  sessionDate,
}: ExtraSessionCompleteProps) {
  const homeHref = sessionDate.startsWith("development-")
    ? `/?sessionDate=${encodeURIComponent(sessionDate)}`
    : "/";

  return (
    <main
      className={`${styles.page} ${styles.extraCompletePage} ${notoSansSC.variable} ${inter.variable}`}
    >
      <div className={styles.canvas}>
        <AppLink href={homeHref} intent="flow-completion" source="extra-completion" fallback="/" className={styles.backButton} aria-label="返回首页">
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
        </AppLink>

        <div className={styles.progressArea}>
          <div className={styles.progressMeta} aria-label="本组已掌握进度">
            <span className={styles.progressLabel}>已掌握</span>
            <strong className={styles.progressNumbers}>
              {masteredCount} / {total}
            </strong>
          </div>
          <div className={styles.progressBar} aria-hidden="true">
            <span
              className={`${styles.progressSegment} ${styles.mastered}`}
              style={{ flexGrow: Math.max(masteredCount, 1), flexBasis: 0 }}
            />
          </div>
        </div>

        <span className={`${styles.itemTag} ${styles.extraTag}`}>额外学习</span>

        <Image
          src={celebrationGoose}
          alt="完成额外学习后开心庆祝的黑鹅"
          className={styles.extraCompleteGoose}
          priority
        />

        <section className={styles.extraCompleteCopy}>
          <span className={styles.extraCompleteSticker}>本组完成</span>
          <h1>这组也完成啦</h1>
          <p className={styles.extraMasteredCount}>
            额外掌握 <strong>{masteredCount}</strong> 个
          </p>
          <p className={styles.extraCompleteHelper}>今天又多认识了一些词。</p>
        </section>

        <AppLink href={homeHref} intent="flow-completion" source="extra-completion" fallback="/" className={styles.extraCompleteCta}>
          <Image src={ctaAccent} alt="" aria-hidden="true" />
          <span>返回首页</span>
        </AppLink>
      </div>
    </main>
  );
}

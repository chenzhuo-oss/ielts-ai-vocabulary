"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/navigation/app-link";
import backIcon from "@/assets/ai-assistant-back.svg";
import bubbleTail from "@/assets/ai-assistant-bubble-tail.svg";
import heroArtwork from "@/assets/ai-assistant-hero.png";
import replyGoose from "@/assets/ai-assistant-avatar.png";
import sendArrow from "@/assets/ai-assistant-send-arrow.svg";
import sendDisabled from "@/assets/ai-assistant-send-disabled.svg";
import sparkleIcon from "@/assets/ai-assistant-sparkle.svg";
import type { SynonymComparison } from "@/lib/ai/synonym-comparison";
import styles from "./ai-assistant.module.css";

type AIAssistantStatus = "loading" | "success" | "error";
type InterchangeabilityLevel = "yes" | "partial" | "no";

const MINIMUM_LOADING_DURATION_MS = 2000;

const levelLabels: Record<InterchangeabilityLevel, string> = {
  yes: "可以互换",
  partial: "部分可以互换",
  no: "不建议互换",
};

function waitForMinimumLoadingDuration(
  startedAt: number,
  signal: AbortSignal,
): Promise<void> {
  const remaining = Math.max(
    0,
    MINIMUM_LOADING_DURATION_MS - (performance.now() - startedAt),
  );
  if (remaining === 0 || signal.aborted) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timer = window.setTimeout(finish, remaining);
    signal.addEventListener("abort", finish, { once: true });
  });
}

function LoadingReply() {
  return (
    <div className={styles.loadingLine} aria-live="polite">
      <span>正在分析这些词的使用差异…</span>
      <span className={styles.typingDots} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function SuccessReply({ comparison }: { comparison: SynonymComparison }) {
  return (
    <>
      <div className={styles.differenceList}>
        {comparison.differences.map((difference) => (
          <section className={styles.differenceItem} key={difference.word}>
            <div className={styles.differenceTitle}>
              <h3 lang="en">{difference.word}</h3>
              <span>{difference.keyword}</span>
            </div>
            <p>{difference.note}</p>
          </section>
        ))}
      </div>
      <section className={styles.interchangeability}>
        <div className={styles.interchangeabilityHeading}>
          <h3>能不能换？</h3>
          <span className={styles.levelBadge}>{levelLabels[comparison.interchangeability.level]}</span>
        </div>
        <p>{comparison.interchangeability.explanation}</p>
      </section>
    </>
  );
}

function ErrorReply({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.errorContent} role="alert">
      <h3>暂时没生成出来</h3>
      <p>请稍后再试</p>
      <button type="button" onClick={onRetry}>再试一次</button>
    </div>
  );
}

export function AIAssistant({
  targetWord,
  comparisonWords,
  previewState,
  returnTo,
}: {
  targetWord: string;
  comparisonWords: string[];
  previewState?: AIAssistantStatus;
  returnTo?: string;
}) {
  const [status, setStatus] = useState<AIAssistantStatus>(
    previewState === "error" ? "error" : "loading",
  );
  const [comparison, setComparison] = useState<SynonymComparison | null>(null);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const requestComparison = useCallback(async () => {
    if (pendingRef.current) return;

    const startedAt = performance.now();
    pendingRef.current = true;
    setStatus("loading");
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/ai/synonym-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetWord }),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("AI_REQUEST_FAILED");

      const payload = (await response.json()) as { comparison?: SynonymComparison };
      if (!payload.comparison) throw new Error("EMPTY_AI_RESULT");

      await waitForMinimumLoadingDuration(startedAt, controller.signal);
      if (controller.signal.aborted) return;
      setComparison(payload.comparison);
      setStatus("success");
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("AI synonym comparison request failed", error);
      await waitForMinimumLoadingDuration(startedAt, controller.signal);
      if (controller.signal.aborted) return;
      setComparison(null);
      setStatus("error");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        pendingRef.current = false;
      }
    }
  }, [targetWord]);

  useEffect(() => {
    if (previewState === "loading" || previewState === "error") return;

    // Deferring by one task prevents React development Strict Mode's probe
    // effect from issuing a duplicate billable request. This is not a UI delay.
    const requestTimer = window.setTimeout(() => void requestComparison(), 0);
    return () => {
      window.clearTimeout(requestTimer);
      abortRef.current?.abort();
    };
  }, [previewState, requestComparison]);

  const retry = () => {
    void requestComparison();
  };

  const safeReturnTo = returnTo?.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : `/words/${encodeURIComponent(targetWord)}`;

  return (
    <article className={styles.canvas} lang="zh-CN">
      <section className={styles.hero} aria-labelledby="ai-assistant-title">
        <Image src={heroArtwork} alt="黑鹅 AI 学习助手正在电脑前思考" className={styles.heroArtwork} priority />
        <div className={styles.heroCopy}>
          <h1 id="ai-assistant-title">嗨，我是你的<br />AI 学习助手</h1>
          <p>可以陪你一起理解词义、<br />辨析用法、分析例句和搭配。</p>
        </div>
        <header className={styles.topBar}>
          <AppLink
            className={styles.backButton}
            href={safeReturnTo}
            intent="back"
            source="ai-assistant"
            fallback={`/words/${encodeURIComponent(targetWord)}`}
            aria-label="返回单词详情"
          >
            <Image src={backIcon} alt="" />
          </AppLink>
        </header>
      </section>

      <div className={styles.contentSurface}>
        <div className={styles.conversationScroll}>
          <div className={styles.contextBar}>
            <section className={styles.context} aria-label="当前单词">
              <span>当前单词</span>
              <strong lang="en">{targetWord}</strong>
            </section>
          </div>

          <div className={styles.conversationBody}>
            <section className={styles.userMessage} aria-label="自动生成的学习请求">
              <p>帮我区分 {comparisonWords.join("、")}，并告诉我哪些场景可以互换、哪些不能。</p>
            </section>

            <section className={styles.replyRow} aria-label="AI 回复">
              <div className={styles.avatarShell}>
                <Image src={replyGoose} alt="正在回答的黑鹅学习助手" className={styles.replyAvatar} />
              </div>
              <div className={`${styles.replyCard} ${styles[status]}`}>
                <Image src={bubbleTail} alt="" className={styles.bubbleTail} />
                <div className={styles.replyHeader}>
                  <span>AI</span>
                  <h2>近义词辨析</h2>
                </div>
                <div className={styles.replyBody}>
                  {status === "loading" && <LoadingReply />}
                  {status === "success" && comparison && <SuccessReply comparison={comparison} />}
                  {status === "error" && <ErrorReply onRetry={retry} />}
                </div>
              </div>
            </section>

            {status === "success" && (
              <p className={styles.disclaimer}>
                <span aria-hidden="true">i</span>
                AI 内容可能存在偏差，请结合上下文判断。
              </p>
            )}
          </div>
        </div>

        <footer className={styles.composerArea}>
          <div className={styles.disabledComposer} aria-disabled="true">
            <Image src={sparkleIcon} alt="" className={styles.composerSparkle} />
            <span>更多 AI 学习能力即将开放</span>
            <span className={styles.composerSend} aria-hidden="true">
              <Image src={sendDisabled} alt="" />
              <Image src={sendArrow} alt="" />
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}

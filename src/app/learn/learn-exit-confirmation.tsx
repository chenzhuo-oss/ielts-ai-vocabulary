"use client";

import Image from "next/image";
import { useEffect } from "react";
import exitGoose from "@/assets/learn-exit-goose.png";
import styles from "./daily-learning.module.css";

type LearnExitConfirmationProps = {
  onContinue: () => void;
  onExit: () => void;
};

export function LearnExitConfirmation({
  onContinue,
  onExit,
}: LearnExitConfirmationProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onContinue();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div className={styles.exitModalOverlay}>
      <section
        className={styles.exitModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-exit-title"
        aria-describedby="learn-exit-description"
      >
        <Image
          src={exitGoose}
          alt="有些舍不得你离开的黑鹅学习伙伴"
          className={styles.exitModalGoose}
          priority
        />

        <h2 id="learn-exit-title" className={styles.exitModalTitle}>
          确定退出学习吗？
        </h2>
        <p id="learn-exit-description" className={styles.exitModalDescription}>
          今天的学习进度会保留，
          <br />
          你可以稍后继续。
        </p>

        <div className={styles.exitModalActions}>
          <button
            type="button"
            className={styles.exitModalSecondaryButton}
            onClick={onExit}
          >
            退出学习
          </button>
          <button
            type="button"
            className={styles.exitModalPrimaryButton}
            onClick={onContinue}
            autoFocus
          >
            继续学习
          </button>
        </div>
      </section>
    </div>
  );
}

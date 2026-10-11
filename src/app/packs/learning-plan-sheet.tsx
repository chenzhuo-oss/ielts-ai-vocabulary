"use client";

import { useEffect, useState } from "react";
import {
  getLearningIntensity,
  INTENSITY_OPTIONS,
  saveLearningIntensity,
  type LearningIntensity,
} from "@/lib/daily-session";
import styles from "./pack.module.css";

const PLAN_NAMES: Record<LearningIntensity, string> = {
  light: "轻量",
  standard: "标准",
  intensive: "进阶",
};

export function LearningPlanSheet({
  packId,
  open,
  onDismiss,
  onSaved,
}: {
  packId: string;
  open: boolean;
  onDismiss: () => void;
  onSaved: (plan: LearningIntensity) => void;
}) {
  const [savedPlan, setSavedPlan] = useState<LearningIntensity>("standard");
  const [pendingPlan, setPendingPlan] = useState<LearningIntensity>("standard");

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const current = getLearningIntensity(packId);
      setSavedPlan(current);
      setPendingPlan(current);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, packId]);

  if (!open) return null;

  return (
    <div className={styles.sheetOverlay} role="presentation" onClick={onDismiss}>
      <section
        className={styles.planSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.sheetHandle} />
        <h2 id="plan-heading">学习计划</h2>
        <p className={styles.sheetSubtitle}>选择固定学习量</p>
        <div className={styles.planOptions}>
          {(Object.keys(INTENSITY_OPTIONS) as LearningIntensity[]).map((planId) => {
            const plan = INTENSITY_OPTIONS[planId];
            const selected = pendingPlan === planId;
            return (
              <button
                type="button"
                key={planId}
                aria-pressed={selected}
                className={styles.planOption}
                onClick={() => setPendingPlan(planId)}
              >
                <span className={styles.planOptionTitle}>
                  {PLAN_NAMES[planId]}计划
                  {savedPlan === planId && <small>当前</small>}
                </span>
                <span className={styles.planOptionDetail}>
                  新词 {plan.newWordTarget} · 最多复习 {plan.reviewLimit}
                </span>
                <span className={styles.planRadio} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p className={styles.planNote}>
          若今日主任务已生成，本次修改不会改变今日任务；新计划从下一次 Daily Session 生成时生效。
        </p>
        <button
          type="button"
          className={styles.savePlan}
          onClick={() => {
            saveLearningIntensity(pendingPlan, packId);
            setSavedPlan(pendingPlan);
            onSaved(pendingPlan);
            onDismiss();
          }}
        >
          <span aria-hidden="true" />保存计划
        </button>
      </section>
    </div>
  );
}

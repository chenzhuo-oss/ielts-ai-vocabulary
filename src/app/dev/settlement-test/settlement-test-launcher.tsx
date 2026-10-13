"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getDevelopmentSettlementDebugInfo,
  getLocalDateKey,
  resetDevelopmentSettlementTest,
  seedDevelopmentSettlementSession,
  type DevelopmentSettlementDebugInfo,
} from "@/lib/daily-session";

function dateWithOffset(offset: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return getLocalDateKey(date);
}

export function SettlementTestLauncher() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<DevelopmentSettlementDebugInfo>({
    checkInDates: [],
    referenceDate: getLocalDateKey(),
    currentStreak: 0,
    totalCheckIns: 0,
  });
  const scenarios = [
    { label: "前天", date: dateWithOffset(-2) },
    { label: "昨天", date: dateWithOffset(-1) },
    { label: "今天", date: dateWithOffset(0) },
  ];

  const refreshDebugInfo = useCallback(() => {
    setDebugInfo(getDevelopmentSettlementDebugInfo());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refreshDebugInfo, 0);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshDebugInfo();
    };

    window.addEventListener("pageshow", refreshDebugInfo);
    window.addEventListener("focus", refreshDebugInfo);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", refreshDebugInfo);
      window.removeEventListener("focus", refreshDebugInfo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshDebugInfo]);

  function reset() {
    resetDevelopmentSettlementTest();
    refreshDebugInfo();
  }

  function seedAndOpen(checkInDate: string) {
    const session = seedDevelopmentSettlementSession(checkInDate);
    if (!session) return;
    router.push(`/complete?sessionDate=${encodeURIComponent(session.sessionDate)}`);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 py-12 sm:px-8">
      <section className="rounded-2xl border border-dashed border-slate-400 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Development only
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Completion Settlement Test
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          使用独立 Session 与 check-in 存储，复用正式 Completion 结算和 streak 算法，不影响真实学习数据。
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-100 p-4 text-sm">
          <span>当前连续</span>
          <strong className="text-right">{debugInfo.currentStreak} 天</strong>
          <span>累计打卡</span>
          <strong className="text-right">{debugInfo.totalCheckIns} 天</strong>
        </div>

        <dl className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700">
          <div>
            <dt className="font-semibold text-slate-500">checkIns</dt>
            <dd className="mt-1 break-words">
              {debugInfo.checkInDates.length > 0
                ? debugInfo.checkInDates.join(", ")
                : "(empty)"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-slate-500">referenceDate</dt>
            <dd>{debugInfo.referenceDate}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-slate-500">calculatedStreak</dt>
            <dd>{debugInfo.currentStreak}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-slate-500">total</dt>
            <dd>{debugInfo.totalCheckIns}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.date}
              type="button"
              onClick={() => seedAndOpen(scenario.date)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-3 text-left hover:bg-slate-50"
            >
              <span>结算{scenario.label} Session</span>
              <span className="text-sm text-slate-500">{scenario.date}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
        >
          Reset Settlement Test Data
        </button>
      </section>
    </main>
  );
}

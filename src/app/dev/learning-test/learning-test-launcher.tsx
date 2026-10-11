"use client";

import { useRouter } from "next/navigation";
import vocabularyData from "@/data/vocabulary.json";
import {
  DEVELOPMENT_TEST_SESSION_DATE,
  resetDevelopmentLearningTestSession,
} from "@/lib/daily-session";
import { resetDevelopmentExtraSessions } from "@/lib/extra-session";

export function LearningTestLauncher() {
  const router = useRouter();
  const testWords = vocabularyData.words.slice(0, 4);

  function resetAndStart(includeReviewItem = false) {
    resetDevelopmentExtraSessions();
    const session = resetDevelopmentLearningTestSession(testWords, includeReviewItem);
    if (!session) return;
    router.push(
      `/learn?sessionDate=${DEVELOPMENT_TEST_SESSION_DATE}&index=0`,
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-12 sm:px-8">
      <section className="rounded-2xl border border-dashed border-slate-400 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Development only
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Daily Learning 四词测试
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          重置独立测试 Session 与测试 Learning State，不读取或修改正式的每日 Session、学习状态和打卡记录。
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {testWords.map((word, index) => (
            <li key={word.id}>
              {String.fromCharCode(65 + index)} · {word.word}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => resetAndStart(false)}
          className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset Test Session 并从 0 / 4 开始
        </button>
        <button
          type="button"
          onClick={() => resetAndStart(true)}
          className="mt-3 w-full rounded-xl bg-amber-200 px-5 py-3 font-medium text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          启动包含复习词的测试
        </button>
      </section>
    </main>
  );
}

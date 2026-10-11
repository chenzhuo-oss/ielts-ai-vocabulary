"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useEffect, useState } from "react";
import backIcon from "@/assets/figma-back-icon.svg";
import chevronDark from "@/assets/figma-chevron-dark.svg";
import chevronLight from "@/assets/figma-chevron-light.svg";
import packGoose from "@/assets/figma-pack-goose.png";
import {
  getLearningIntensity,
  INTENSITY_OPTIONS,
  type LearningIntensity,
} from "@/lib/daily-session";
import {
  getPackProgress,
  getVocabularyPack,
  VOCABULARY_PACKS,
} from "@/lib/vocabulary-packs";
import { LearningPlanSheet } from "../learning-plan-sheet";
import styles from "../pack.module.css";

const noto = Noto_Sans_SC({ variable: "--font-noto-sans-sc", display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", display: "swap", subsets: ["latin"] });
const PLAN_NAMES: Record<LearningIntensity, string> = { light: "轻量", standard: "标准", intensive: "进阶" };

export function PackDetailClient({ packId }: { packId: string }) {
  const pack = getVocabularyPack(packId);
  const [learned, setLearned] = useState(0);
  const [plan, setPlan] = useState<LearningIntensity>("standard");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLearned(getPackProgress(packId).learnedWordCount);
      setPlan(getLearningIntensity(packId));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [packId]);

  if (!pack) return <main className={styles.notFound}><h1>未找到该词包</h1><Link href="/">返回首页</Link></main>;

  const planConfig = INTENSITY_OPTIONS[plan];
  return (
    <main className={`${styles.page} ${noto.variable} ${inter.variable}`}>
      <div className={styles.canvas}>
        <header className={styles.pageHeader}>
          <Link href="/" className={styles.backButton} aria-label="返回首页"><Image src={backIcon} alt="" /></Link>
        </header>

        <section className={styles.packHero}>
          <h1>{pack.name}</h1>
          <p lang="en">{pack.nameEn}</p>
          <div className={styles.packMetric}><strong>{learned}</strong><span>/ {pack.totalWordCount}</span></div>
          <Image src={packGoose} alt="词包学习伙伴黑鹅" className={styles.packGoose} />
          <span className={styles.pinkSticker} aria-hidden="true" />
          <span className={styles.yellowSticker} aria-hidden="true" />
          <button type="button" className={styles.heroPlanRow} onClick={() => setSheetOpen(true)}>
            <span><strong>学习计划</strong><small>{PLAN_NAMES[plan]}计划 · 新词{planConfig.newWordTarget} · 复习上限{planConfig.reviewLimit}</small></span>
            <Image src={chevronDark} alt="" />
          </button>
        </section>

        <section className={styles.vocabularyEntry}>
          <Link href={`/packs/${pack.id}/words`}>
            <span><strong>查看词表</strong><small>{pack.totalWordCount} 个单词</small></span>
            <span className={styles.entryArrow}><Image src={chevronLight} alt="" /></span>
          </Link>
        </section>

        <section className={styles.otherPacks}>
          <h2>其他词包</h2>
          <p>未来可以在这里切换更多学习主题</p>
          <div className={styles.comingGrid}>
          {VOCABULARY_PACKS.filter((item) => item.id !== pack.id).map((item) => (
            <div className={styles.comingPack} key={item.id} aria-disabled="true">
              <span className={styles.comingAccent} aria-hidden="true" />
              <strong>{item.nameEn === "IELTS Academic Vocabulary" ? <>IELTS Academic<br />Vocabulary</> : <>IELTS 高频<br />场景词汇</>}</strong>
              <em>即将开放</em>
            </div>
          ))}
          </div>
        </section>
      </div>
      <LearningPlanSheet packId={pack.id} open={sheetOpen} onDismiss={() => setSheetOpen(false)} onSaved={setPlan} />
    </main>
  );
}

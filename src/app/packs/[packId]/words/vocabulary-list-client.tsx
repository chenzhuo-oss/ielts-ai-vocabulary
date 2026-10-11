"use client";

import Image from "next/image";
import Link from "next/link";
import backIcon from "@/assets/figma-back-icon.svg";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useEffect, useState } from "react";
import { getAllLearningStates, type LearningState } from "@/lib/learning-state";
import {
  getPackProgress,
  getPackWordStatus,
  getVocabularyPack,
  type PackWordStatus,
} from "@/lib/vocabulary-packs";
import styles from "../../pack.module.css";

const noto = Noto_Sans_SC({ variable: "--font-noto-sans-sc", display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", display: "swap", subsets: ["latin"] });
const STATUS_LABELS: Record<PackWordStatus, string> = { unlearned: "未学习", learned: "已学习", review: "待复习" };

export function VocabularyListClient({ packId }: { packId: string }) {
  const pack = getVocabularyPack(packId);
  const [states, setStates] = useState<Record<string, LearningState>>({});
  const [learned, setLearned] = useState(0);

  useEffect(() => {
    const load = () => {
      setStates(getAllLearningStates());
      setLearned(getPackProgress(packId).learnedWordCount);
    };
    const timer = window.setTimeout(load, 0);
    window.addEventListener("pageshow", load);
    return () => { window.clearTimeout(timer); window.removeEventListener("pageshow", load); };
  }, [packId]);

  if (!pack) return <main className={styles.notFound}><h1>未找到该词包</h1><Link href="/">返回首页</Link></main>;

  const percentage = pack.totalWordCount ? (learned / pack.totalWordCount) * 100 : 0;
  return (
    <main className={`${styles.page} ${noto.variable} ${inter.variable}`}>
      <div className={`${styles.canvas} ${styles.listCanvas}`}>
        <header className={styles.listHeader}>
          <Link href={`/packs/${pack.id}`} className={styles.backButton} aria-label="返回词包详情"><Image src={backIcon} alt="" /></Link>
          <h1>{pack.name}</h1><p><strong>{learned}</strong> / {pack.totalWordCount}</p>
          <div className={styles.listProgress} aria-label={`首次学习进度 ${learned} / ${pack.totalWordCount}`}>
            <span style={{ width: `${percentage}%` }} />
          </div>
        </header>

        <section className={styles.wordList}>
          <h2>全部 {pack.totalWordCount} 个单词</h2>
          <ul>
            {pack.words.map((word) => {
              const status = getPackWordStatus(states[word.id]);
              return (
                <li key={word.id}>
                  <Link href={`/words/${encodeURIComponent(word.word)}?mode=browse&packId=${encodeURIComponent(pack.id)}`}>
                    <span className={styles.wordCopy}>
                      <strong lang="en">{word.word}</strong>
                      <small>{word.meanings[0]?.definitionZh ?? ""}</small>
                    </span>
                    <span className={`${styles.wordStatus} ${styles[`status_${status}`]}`}>{STATUS_LABELS[status]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

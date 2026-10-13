"use client";

import Image from "next/image";
import backIcon from "@/assets/figma-back-icon.svg";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppLink } from "@/components/navigation/app-link";
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
const getScrollStorageKey = (packId: string) => `vocabulary-list-scroll:${packId}`;

export function VocabularyListClient({ packId }: { packId: string }) {
  const pack = getVocabularyPack(packId);
  const [states, setStates] = useState<Record<string, LearningState>>({});
  const [learned, setLearned] = useState(0);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const initializedScrollPackRef = useRef<string | null>(null);

  useEffect(() => {
    const load = () => {
      setStates(getAllLearningStates());
      setLearned(getPackProgress(packId).learnedWordCount);
    };
    const timer = window.setTimeout(load, 0);
    window.addEventListener("pageshow", load);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", load);
    };
  }, [packId]);

  useLayoutEffect(() => {
    const scrollRegion = listScrollRef.current;
    if (!scrollRegion || initializedScrollPackRef.current === packId) return;
    initializedScrollPackRef.current = packId;

    const shouldRestore = new URLSearchParams(window.location.search).get("restoreScroll") === "1";
    const storageKey = getScrollStorageKey(packId);
    const savedPosition = shouldRestore
      ? Number.parseFloat(window.sessionStorage.getItem(storageKey) ?? "")
      : Number.NaN;

    scrollRegion.scrollTo({
      top: Number.isFinite(savedPosition) ? savedPosition : 0,
      behavior: "auto",
    });
    window.sessionStorage.removeItem(storageKey);
  }, [packId]);

  function saveScrollPosition() {
    window.sessionStorage.setItem(
      getScrollStorageKey(packId),
      String(listScrollRef.current?.scrollTop ?? 0),
    );
  }

  if (!pack) return <main className={styles.notFound}><h1>未找到该词包</h1><AppLink href="/" intent="back" source="vocabulary-list" fallback="/">返回首页</AppLink></main>;

  const percentage = pack.totalWordCount ? (learned / pack.totalWordCount) * 100 : 0;
  return (
    <main className={`${styles.page} ${styles.listPage} ${noto.variable} ${inter.variable}`}>
      <div className={`${styles.canvas} ${styles.listCanvas}`}>
        <header className={styles.listHeader}>
          <AppLink href={`/packs/${pack.id}`} intent="back" source="vocabulary-list" fallback="/" className={styles.backButton} aria-label="返回词包详情"><Image src={backIcon} alt="" /></AppLink>
          <h1>{pack.name}</h1><p><strong>{learned}</strong> / {pack.totalWordCount}</p>
          <div className={styles.listProgress} aria-label={`首次学习进度 ${learned} / ${pack.totalWordCount}`}>
            <span style={{ width: `${percentage}%` }} />
          </div>
        </header>

        <div ref={listScrollRef} className={styles.listScrollRegion}>
          <section className={styles.wordList}>
            <h2>全部 {pack.totalWordCount} 个单词</h2>
            <ul>
              {pack.words.map((word) => {
                const status = getPackWordStatus(states[word.id]);
                return (
                  <li key={word.id}>
                    <AppLink
                      href={`/words/${encodeURIComponent(word.word)}?mode=browse&packId=${encodeURIComponent(pack.id)}&restoreScroll=1`}
                      intent="forward"
                      source="vocabulary-list"
                      fallback={`/packs/${pack.id}`}
                      onClick={saveScrollPosition}
                    >
                      <span className={styles.wordCopy}>
                        <strong lang="en">{word.word}</strong>
                        <small>{word.meanings[0]?.definitionZh ?? ""}</small>
                      </span>
                      <span className={`${styles.wordStatus} ${styles[`status_${status}`]}`}>{STATUS_LABELS[status]}</span>
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

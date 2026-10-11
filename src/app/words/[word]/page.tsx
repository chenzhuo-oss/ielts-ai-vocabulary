import { Inter, Noto_Sans_SC } from "next/font/google";
import Link from "next/link";
import vocabularyData from "@/data/vocabulary.json";
import { ExampleSentences } from "./example-sentences";
import { WordDetailHeader } from "./word-detail-header";
import { WordLearningControls } from "./word-learning-controls";
import styles from "./word-detail.module.css";

const notoSansSC = Noto_Sans_SC({ variable: "--font-noto-sans-sc", display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", display: "swap", subsets: ["latin"] });

type Meaning = { id: string; partOfSpeech: string; definitionZh: string };
type ExampleSentence = { text: string; translation: string; source: string; meaningId: string };
type Collocation = { text: string; translation: string };
type WordEntry = {
  id: string;
  word: string;
  phonetic: string;
  meanings: Meaning[];
  collocations: Collocation[];
  exampleSentences: ExampleSentence[];
  synonyms: string[];
};
type VocabularySet = { id: string; name: string; words: WordEntry[] };
const vocabulary: VocabularySet = vocabularyData;

type WordDetailPageProps = {
  params: Promise<{ word: string }>;
  searchParams: Promise<{ index?: string; sessionDate?: string; sessionType?: string; extraSessionId?: string; mode?: string; packId?: string }>;
};

function SectionHeading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionIndex}>{index}</span>
      <h2>{children}</h2>
    </div>
  );
}

export default async function WordDetailPage({ params, searchParams }: WordDetailPageProps) {
  const { word: wordParam } = await params;
  const { index: rawIndex, sessionDate, sessionType, extraSessionId, mode, packId } = await searchParams;
  const browseMode = mode === "browse" && Boolean(packId);
  const learningSessionType = sessionType === "extra" ? "extra" : "main";
  const wordEntry = vocabulary.words.find((entry) => entry.word === wordParam);

  if (!wordEntry) {
    return <main className={styles.notFound}><h1>未找到该单词</h1><p>当前词库中没有与“{wordParam}”对应的词条。</p></main>;
  }

  const parsedIndex = Number.parseInt(rawIndex ?? "-1", 10);
  const currentItemIndex = Number.isInteger(parsedIndex) ? parsedIndex : -1;
  const query = new URLSearchParams();
  if (sessionDate) query.set("sessionDate", sessionDate);
  query.set("index", String(Math.max(0, currentItemIndex)));
  if (learningSessionType === "extra") {
    query.set("sessionType", "extra");
    if (extraSessionId) query.set("extraSessionId", extraSessionId);
  }
  const detailQuery = new URLSearchParams();
  if (browseMode) {
    detailQuery.set("mode", "browse");
    detailQuery.set("packId", packId!);
  } else {
    if (sessionDate) detailQuery.set("sessionDate", sessionDate);
    detailQuery.set("index", String(Math.max(0, currentItemIndex)));
    if (learningSessionType === "extra") {
      detailQuery.set("sessionType", "extra");
      if (extraSessionId) detailQuery.set("extraSessionId", extraSessionId);
    }
  }
  const returnTo = `/words/${encodeURIComponent(wordEntry.word)}?${detailQuery.toString()}`;
  const aiQuery = new URLSearchParams({ word: wordEntry.word, returnTo });

  return (
    <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
      <article className={`${styles.canvas} ${browseMode ? styles.browseCanvas : ""}`} lang="zh-CN">
        <WordDetailHeader
          wordId={wordEntry.id}
          word={wordEntry.word}
          phonetic={wordEntry.phonetic}
          backHref={browseMode ? `/packs/${encodeURIComponent(packId!)}/words` : `/learn?${query.toString()}`}
          sessionDate={sessionDate}
          sessionType={learningSessionType}
          extraSessionId={extraSessionId}
          mode={browseMode ? "browse" : "learning"}
        />

        <div className={styles.content}>
          <section className={styles.firstSection} aria-labelledby="meaning-heading">
            <SectionHeading index="01"><span id="meaning-heading">中文释义</span></SectionHeading>
            <div className={styles.meaningList}>
              {wordEntry.meanings.map((meaning) => (
                <div key={meaning.id} className={styles.meaningRow}>
                  <span className={styles.partOfSpeech} lang="en">{meaning.partOfSpeech}</span>
                  <p>{meaning.definitionZh}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="collocations-heading">
            <SectionHeading index="02"><span id="collocations-heading">常用搭配</span></SectionHeading>
            <ul className={styles.collocationBlock}>
              {wordEntry.collocations.map((collocation) => (
                <li key={collocation.text}>
                  <span className={styles.collocationEnglish} lang="en">{collocation.text}</span>
                  <span className={styles.collocationChinese}>{collocation.translation}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="examples-heading">
            <SectionHeading index="03"><span id="examples-heading">例句</span></SectionHeading>
            <ExampleSentences key={wordEntry.word} examples={wordEntry.exampleSentences} />
          </section>

          <section className={styles.section} aria-labelledby="synonyms-heading">
            <SectionHeading index="04"><span id="synonyms-heading">近义词</span></SectionHeading>
            <ul className={styles.synonymList}>
              {wordEntry.synonyms.map((synonym) => <li key={synonym} lang="en">{synonym}</li>)}
            </ul>
            <Link
              className={styles.aiPlaceholder}
              href={`/ai-assistant?${aiQuery.toString()}`}
              aria-label={`使用 AI 学习助手辨析 ${wordEntry.word} 的近义词`}
            >
              <div className={styles.aiHeading}><span>AI</span><h3>AI 近义词辨析</h3></div>
              <p>比较 {wordEntry.synonyms.slice(0, 3).join("、")} 的语气和使用场景。</p>
              <span className={styles.aiStatus}>进入助手</span>
              <span className={styles.aiEntryArrow} aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        {!browseMode && (
          <footer className={styles.footer}>
            <WordLearningControls
              wordId={wordEntry.id}
              mode="navigation"
              sessionDate={sessionDate}
              sessionType={learningSessionType}
              extraSessionId={extraSessionId}
              currentItemIndex={currentItemIndex}
              className={styles.primaryCta}
            />
          </footer>
        )}
      </article>
    </main>
  );
}

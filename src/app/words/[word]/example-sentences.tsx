"use client";

import { useState } from "react";
import styles from "./word-detail.module.css";

type ExampleSentence = { text: string; translation: string; source: string; meaningId: string };

export function ExampleSentences({ examples }: { examples: ExampleSentence[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMultipleExamples = examples.length > 1;
  const visibleExamples = expanded ? examples : examples.slice(0, 1);

  return (
    <div className={styles.examples}>
      <div id="word-example-sentences" className={styles.exampleList}>
        {visibleExamples.map((example, index) => (
          <article key={`${example.text}-${index}`} className={styles.exampleItem}>
            <p className={styles.exampleEnglish} lang="en">{example.text}</p>
            <p className={styles.exampleChinese}>{example.translation}</p>
            <p className={styles.exampleSource}>{example.source}</p>
          </article>
        ))}
      </div>
      {hasMultipleExamples && (
        <button
          type="button"
          className={styles.exampleToggle}
          aria-expanded={expanded}
          aria-controls="word-example-sentences"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "收起例句" : `查看全部 ${examples.length} 条`}
        </button>
      )}
    </div>
  );
}

import { Inter, Noto_Sans_SC } from "next/font/google";
import { getSynonymContext } from "@/lib/ai/synonym-comparison";
import { AIAssistant } from "./ai-assistant";
import styles from "./ai-assistant.module.css";

const notoSansSC = Noto_Sans_SC({ variable: "--font-noto-sans-sc", display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", display: "swap", subsets: ["latin"] });

type AIAssistantPageProps = {
  searchParams: Promise<{ word?: string; state?: string; returnTo?: string }>;
};

export default async function AIAssistantPage({ searchParams }: AIAssistantPageProps) {
  const { word = "significant", state, returnTo } = await searchParams;
  const previewState = state === "loading" || state === "success" || state === "error" ? state : undefined;
  let comparisonWords: string[] = [word];

  try {
    comparisonWords = getSynonymContext(word).comparisonWords;
  } catch {
    // The API request will enter the existing Error state for invalid targets.
  }

  return (
    <main className={`${styles.page} ${notoSansSC.variable} ${inter.variable}`}>
      <AIAssistant
        targetWord={word}
        comparisonWords={comparisonWords}
        previewState={previewState}
        returnTo={returnTo}
      />
    </main>
  );
}

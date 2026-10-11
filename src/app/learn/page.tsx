import { DailyLearningSession } from "./daily-learning-session";

type DailyLearningPageProps = {
  searchParams: Promise<{
    index?: string;
    sessionDate?: string;
    sessionType?: string;
    extraSessionId?: string;
  }>;
};

export default async function DailyLearningPage({
  searchParams,
}: DailyLearningPageProps) {
  const { index, sessionDate, sessionType, extraSessionId } = await searchParams;

  return (
    <DailyLearningSession
      rawIndex={index}
      sessionDate={sessionDate}
      sessionType={sessionType === "extra" ? "extra" : "main"}
      extraSessionId={extraSessionId}
    />
  );
}

import { CompletionClient } from "./completion-client";

type CompletionPageProps = {
  searchParams: Promise<{ sessionDate?: string }>;
};

export default async function CompletionPage({ searchParams }: CompletionPageProps) {
  const { sessionDate } = await searchParams;
  return <CompletionClient sessionDate={sessionDate} />;
}

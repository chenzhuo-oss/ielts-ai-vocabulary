import { VocabularyListClient } from "./vocabulary-list-client";

export default async function VocabularyListPage({
  params,
}: {
  params: Promise<{ packId: string }>;
}) {
  const { packId } = await params;
  return <VocabularyListClient packId={packId} />;
}

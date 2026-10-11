import { PackDetailClient } from "./pack-detail-client";

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ packId: string }>;
}) {
  const { packId } = await params;
  return <PackDetailClient packId={packId} />;
}

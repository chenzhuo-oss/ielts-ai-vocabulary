import { HomeDashboard } from "./home-dashboard";

type HomePageProps = {
  searchParams: Promise<{ sessionDate?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { sessionDate } = await searchParams;
  return <HomeDashboard requestedSessionDate={sessionDate} />;
}

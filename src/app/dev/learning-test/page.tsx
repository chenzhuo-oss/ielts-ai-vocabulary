import { notFound } from "next/navigation";
import { LearningTestLauncher } from "./learning-test-launcher";

export default function LearningTestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <LearningTestLauncher />;
}

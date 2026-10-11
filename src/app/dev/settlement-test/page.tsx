import { notFound } from "next/navigation";
import { SettlementTestLauncher } from "./settlement-test-launcher";

export default function SettlementTestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SettlementTestLauncher />;
}

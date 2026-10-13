import type { Metadata } from "next";
import { NavigationProvider } from "@/components/navigation/navigation-provider";
import { NavigationShell } from "@/components/navigation/navigation-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS AI Vocabulary",
  description: "IELTS vocabulary learning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <NavigationShell>{children}</NavigationShell>
        </NavigationProvider>
      </body>
    </html>
  );
}

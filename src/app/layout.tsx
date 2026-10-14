import type { Metadata, Viewport } from "next";
import { NavigationProvider } from "@/components/navigation/navigation-provider";
import { NavigationShell } from "@/components/navigation/navigation-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS AI Vocabulary",
  description: "IELTS vocabulary learning application",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HERO记单词",
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f4ea",
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

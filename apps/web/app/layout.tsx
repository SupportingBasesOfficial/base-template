import "@repo/tailwind-config/globals.css";
import { Toaster } from "@repo/ui";

import { ThemeProvider } from "@/components/theme-provider";
import { WebVitalsReporter } from "./web-vitals";

export const metadata = {
  title: {
    default: "Base Template",
    template: "%s — Base Template",
  },
  description:
    "Base Template Universal - Monorepo Turborepo + Next.js + Supabase",
  applicationName: "Base Template",
  authors: [{ name: "SupportingBases" }],
  keywords: [
    "monorepo",
    "turborepo",
    "next.js",
    "supabase",
    "typescript",
    "template",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Base Template Universal",
    description: "Monorepo Turborepo + Next.js 15 + Supabase + TypeScript",
    siteName: "Base Template",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Template Universal",
    description: "Monorepo Turborepo + Next.js 15 + Supabase + TypeScript",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <WebVitalsReporter />
        </ThemeProvider>
      </body>
    </html>
  );
}

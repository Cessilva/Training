import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { clearThemeScript } from "@/lib/fouc";
import { ThemeProvider } from "@/contexts/theme-context";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Senior Frontend Training - React/TypeScript",
  description:
    "Entrenamiento intensivo para posición Senior Frontend Developer con ejercicios técnicos de React y TypeScript",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {clearThemeScript}
        </Script>
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}

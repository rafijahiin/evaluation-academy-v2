import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/chrome/Navbar";
import { FloatingProgressBar } from "@/components/chrome/FloatingProgressBar";
import { Breadcrumb } from "@/components/chrome/Breadcrumb";
import { MotionProvider } from "@/components/motion/MotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Evaluation Academy — Learn the craft of evaluation",
    template: "%s · Evaluation Academy",
  },
  description:
    "An immersive course on the UNFPA Evaluation Handbook 2024. Five phases, fifty lessons, hands-on tools.",
  metadataBase: new URL("https://evaluation-academy-v2.vercel.app"),
  openGraph: {
    title: "Evaluation Academy",
    description: "Learn the craft of evaluation, chapter by chapter.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <MotionProvider>
          <FloatingProgressBar />
          <Navbar />
          <Breadcrumb />
          <main className="flex-1">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}

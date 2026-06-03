import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/chrome/Navbar";
import { Footer } from "@/components/chrome/Footer";
import { FloatingProgressBar } from "@/components/chrome/FloatingProgressBar";
import { Breadcrumb } from "@/components/chrome/Breadcrumb";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CommandPalette } from "@/components/search/CommandPalette";

// UNFPA brand typeface — Atkinson Hyperlegible (Next), used for ALL text
// per the brand guidelines (no serif/display swaps). Designed by the
// Braille Institute for maximum legibility.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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

export const viewport: Viewport = {
  // UNFPA Orange — tints the mobile browser chrome.
  themeColor: "#F96000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={atkinson.variable}>
      <body className="min-h-screen flex flex-col">
        <MotionProvider>
          <FloatingProgressBar />
          <Navbar />
          <Breadcrumb />
          <main className="flex-1">{children}</main>
          <Footer />
          <CommandPalette />
        </MotionProvider>
      </body>
    </html>
  );
}

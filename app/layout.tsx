import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevHire AI — Candidate Intelligence for Tech Hiring",
    template: "%s | DevHire AI",
  },
  description:
    "AI-powered technical hiring platform. Automate screening with resume intelligence, GitHub code auditing, sandbox coding challenges, and dynamic AI interviews.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "DevHire AI — Candidate Intelligence for Tech Hiring",
    description:
      "Hire developers based on what they can actually build. Multi-signal AI screening with resume analysis, GitHub auditing, and dynamic interviews.",
    siteName: "DevHire AI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

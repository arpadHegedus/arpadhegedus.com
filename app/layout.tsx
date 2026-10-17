import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import { profile } from "@/content/profile";
import "@/styles/tokens.css";
import "@/styles/reset.css";
import "@/styles/base.css";
import "@/styles/glow.css";
import "@/styles/typography.css";
import "@/styles/interactive.css";
import "@/styles/prose.css";
import "@/styles/layout.css";

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.jobTitle}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: profile.name,
    title: `${profile.name} | ${profile.jobTitle}`,
    description: profile.description,
  },
  twitter: { card: "summary" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={commissioner.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arpad Hegedus | UX Architect",
  description: "UK based engineer with a focus on user-centered design and digital product development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={commissioner.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { brand } from "@/content/decks/sarak-data";

const alibaba = localFont({
  src: [
    {
      path: "../public/fonts/alibaba/alibaba-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/alibaba/alibaba-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/alibaba/alibaba-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-alibaba",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "سارک از نگاه داده",
  description: `${brand.auditor} · ${brand.auditDate}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${alibaba.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

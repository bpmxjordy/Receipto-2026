import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Receipto — Track your receipts. Know your impact.",
  description:
    "Receipto digitises your paper receipts, auto-categorises every item, and shows your spending and CO₂ footprint. Available on iOS.",
  keywords: [
    "receipts",
    "spending tracker",
    "CO2 footprint",
    "carbon footprint",
    "receipt scanner",
    "expense tracker",
    "sustainability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

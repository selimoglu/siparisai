import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

// STK Bureau Sans dosyaları gelene kadar ona en yakın sade grotesk: Inter Tight
const head = Inter_Tight({ variable: "--font-head", subsets: ["latin", "latin-ext"] });
const body = Inter_Tight({ variable: "--font-body", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "SiparişAI",
  description: "Restoranınıza komisyonsuz sipariş sitesi ve yapay zekalı pazarlama.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${head.variable} ${body.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

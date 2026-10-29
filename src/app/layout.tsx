import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const head = Bricolage_Grotesque({ variable: "--font-head", subsets: ["latin", "latin-ext"] });
const body = Figtree({ variable: "--font-body", subsets: ["latin", "latin-ext"] });

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

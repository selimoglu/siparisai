import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiparişAI",
  description: "Restoranınıza komisyonsuz sipariş sitesi ve yapay zekalı pazarlama.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

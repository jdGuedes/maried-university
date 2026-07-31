import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-maried-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-maried-display", display: "swap" });

export const metadata: Metadata = {
  title: "MARIED UNIVERSITY",
  description: "Fundacao frontend da MARIED UNIVERSITY.",
  applicationName: "MARIED UNIVERSITY"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}

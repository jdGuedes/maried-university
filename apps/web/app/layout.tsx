import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { PWAController } from "@/components/pwa";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-maried-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-maried-display", display: "swap" });

export const metadata: Metadata = {
  title: "MARIED UNIVERSITY",
  description: "Fundacao frontend da MARIED UNIVERSITY.",
  applicationName: "MARIED UNIVERSITY",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MARIED"
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/maried-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/maried-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#a87935"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
        <PWAController />
      </body>
    </html>
  );
}
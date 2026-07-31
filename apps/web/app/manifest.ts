import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MARIED UNIVERSITY",
    short_name: "MARIED",
    description: "Aplicacao web da MARIED UNIVERSITY.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#a87935",
    lang: "pt-BR",
    categories: ["business", "productivity", "education"],
    icons: [
      {
        src: "/icons/maried-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/maried-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/maried-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
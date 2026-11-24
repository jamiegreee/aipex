import type { MetadataRoute } from "next";

// Lets visitors add AIPEX to their home screen. Icons are made by
// scripts/generate-app-icons.mjs; colours match the dark palette in theme.css.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIPEX — AI Policy Exchange",
    short_name: "AIPEX",
    description:
      "The online community for AI policy professionals across the public and private sectors.",
    start_url: "/",
    display: "standalone",
    background_color: "#10140f",
    theme_color: "#10140f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

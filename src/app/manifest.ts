import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HERO记单词",
    short_name: "HERO记单词",
    description: "IELTS vocabulary learning application",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f4ea",
    theme_color: "#f8f4ea",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

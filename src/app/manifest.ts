import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIRAJ",
    short_name: "SIRAJ",
    description: "Platform edukasi Islam dan dakwah",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8F7F2",
    theme_color: "#174A3A",
    icons: [
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

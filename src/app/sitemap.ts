import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://detik-news2.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];

  const categories = [
    "berita", "ekonomi", "hiburan", "olahraga", "teknologi", "internasional",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "always" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}

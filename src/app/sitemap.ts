import type { MetadataRoute } from 'next';

const SITE_URL = 'https://detik-news2.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
  ];

  const categories = ['berita', 'ekonomi', 'hiburan', 'olahraga', 'teknologi', 'internasional'];
  const categoryPages = categories.map((cat) => ({
    url: `${SITE_URL}?category=${cat}`,
    lastModified: now,
    changeFrequency: 'always' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}

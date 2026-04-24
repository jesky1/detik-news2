export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  category: string;
  isHeadline: boolean;
  isBreaking: boolean;
  publishedAt: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  count: number;
}

export const categoryColors: Record<string, string> = {
  berita: 'bg-red-600',
  ekonomi: 'bg-amber-600',
  hiburan: 'bg-purple-600',
  olahraga: 'bg-green-600',
  teknologi: 'bg-sky-600',
  internasional: 'bg-blue-600',
};

export const categoryLabels: Record<string, string> = {
  berita: 'Berita',
  ekonomi: 'Ekonomi',
  hiburan: 'Hiburan',
  olahraga: 'Olahraga',
  teknologi: 'Teknologi',
  internasional: 'Internasional',
};

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  category: string;
  isHeadline?: boolean;
  isBreaking?: boolean;
  publishedAt: string;
  createdAt?: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  count: number;
  createdAt?: string;
}

export const categoryLabels: Record<string, string> = {
  berita: 'Berita',
  ekonomi: 'Ekonomi',
  hiburan: 'Hiburan',
  olahraga: 'Olahraga',
  teknologi: 'Teknologi',
  internasional: 'Internasional',
};

export const categoryColors: Record<string, string> = {
  berita: 'bg-red-600',
  ekonomi: 'bg-emerald-600',
  hiburan: 'bg-purple-600',
  olahraga: 'bg-orange-600',
  teknologi: 'bg-cyan-600',
  internasional: 'bg-blue-600',
};

export const categoryNav = [
  { label: 'Berita', category: 'berita' },
  { label: 'Ekonomi', category: 'ekonomi' },
  { label: 'Hiburan', category: 'hiburan' },
  { label: 'Olahraga', category: 'olahraga' },
  { label: 'Teknologi', category: 'teknologi' },
  { label: 'Internasional', category: 'internasional' },
];

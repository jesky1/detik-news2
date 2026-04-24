'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { categoryColors, categoryLabels } from './types';
import type { NewsArticle, TrendingTopic } from './types';

const fallbackTrending: TrendingTopic[] = [
  { id: 't1', topic: 'Pemilu 2025', count: 12500 },
  { id: 't2', topic: 'Timnas Indonesia', count: 9800 },
  { id: 't3', topic: 'Harga Emas', count: 8200 },
  { id: 't4', topic: 'ChatGPT 5', count: 7100 },
  { id: 't5', topic: 'Gempa Sulawesi', count: 6500 },
  { id: 't6', topic: 'FLPP 2025', count: 5900 },
  { id: 't7', topic: 'Saham AI', count: 5200 },
  { id: 't8', topic: 'Film Indonesia', count: 4600 },
  { id: 't9', topic: 'Vaksin Demam Berdarah', count: 3800 },
  { id: 't10', topic: 'UN 2025', count: 3100 },
];

const fallbackPopular: NewsArticle[] = [
  { id: 'p1', title: 'Heboh! Mahasiswa Temukan Spesies Baru di Hutan Kalimantan', summary: 'Penemuan spesies katak baru ini membuat dunia ilmiah internasional terkejut.', imageUrl: 'https://picsum.photos/seed/pop1/120/80', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T08:00:00Z' },
  { id: 'p2', title: 'Resep Rahasia Chef Terkenal Akhirnya Terungkap Setelah 20 Tahun', summary: 'Chef Renata akhirnya membagikan rahasia masakannya yang legendaris.', imageUrl: 'https://picsum.photos/seed/pop2/120/80', sourceUrl: '#', sourceName: 'DetikFood', category: 'hiburan', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T09:00:00Z' },
  { id: 'p3', title: 'Kisah Sukses Anak Desa yang Jadi CEO Perusahaan Unicorn', summary: 'Dari pedagang asongan hingga memimpin perusahaan senilai Rp 10 triliun.', imageUrl: 'https://picsum.photos/seed/pop3/120/80', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T10:00:00Z' },
  { id: 'p4', title: 'Viral! Fenomena Langit Aneh Terlihat di Seluruh Indonesia', summary: 'Warga di berbagai kota mengabadikan fenomena alam yang sangat langka ini.', imageUrl: 'https://picsum.photos/seed/pop4/120/80', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T11:00:00Z' },
  { id: 'p5', title: '5 Aplikasi Produktivitas yang Wajib Dimiliki di 2025', summary: 'Aplikasi-aplikasi ini bisa membantu meningkatkan efisiensi kerja hingga 200%.', imageUrl: 'https://picsum.photos/seed/pop5/120/80', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T12:00:00Z' },
];

const fallbackComments: NewsArticle[] = [
  { id: 'c1', title: 'Wajar atau Tidak? Ini Alasan Harga BBM Naik Lagi', summary: '', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T08:00:00Z' },
  { id: 'c2', title: 'Benarkah Pindah ke Listrik Lebih Hemat? Ini Hitungannya', summary: '', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T09:00:00Z' },
  { id: 'c3', title: 'Kontroversi Kebijakan Kerja dari Kantor yang Baru', summary: '', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: false, isBreaking: false, publishedAt: '2025-03-05T10:00:00Z' },
];

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}rb`;
  }
  return count.toString();
}

export function Sidebar() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [popular, setPopular] = useState<NewsArticle[]>([]);
  const [comments, setComments] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSidebarData() {
      try {
        const [trendingRes, popularRes] = await Promise.all([
          fetch('/api/news/trending'),
          fetch('/api/news?category=berita'),
        ]);

        if (trendingRes.ok) {
          const data = await trendingRes.json();
          // API returns { topics } 
          const topics = data.topics || data;
          setTrending(Array.isArray(topics) ? topics : []);
        } else {
          setTrending(fallbackTrending);
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          // API returns { articles, category }
          const articles = data.articles || data;
          setPopular(Array.isArray(articles) ? articles : fallbackPopular);
        } else {
          setPopular(fallbackPopular);
        }
      } catch {
        setTrending(fallbackTrending);
        setPopular(fallbackPopular);
      } finally {
        setComments(fallbackComments);
        setLoading(false);
      }
    }
    fetchSidebarData();
  }, []);

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {/* Trending Topics */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-[#e00000]" />
            <span>Trending</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0 max-h-96 overflow-y-auto custom-scrollbar">
              {trending.map((topic, index) => (
                <div key={topic.id}>
                  <a
                    href="#"
                    className="flex items-start gap-3 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <span className="text-[#e00000] font-bold text-sm min-w-[20px]">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {topic.topic}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatCount(topic.count)} pembaca
                      </p>
                    </div>
                  </a>
                  {index < trending.length - 1 && <Separator className="my-0" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terpopuler / Most Popular */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Terpopuler</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-24 rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {popular.map((article) => (
                <a
                  key={article.id}
                  href={article.sourceUrl}
                  className="flex gap-3 group"
                >
                  <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={article.imageUrl || 'https://picsum.photos/seed/default/120/80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 text-[9px] px-1.5 py-0 mb-1`}>
                      {categoryLabels[article.category] || article.category}
                    </Badge>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#e00000] transition-colors leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{article.sourceName}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Komentar Terbanyak */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-sky-500" />
            <span>Komentar Terbanyak</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map((article, index) => (
                <div key={article.id}>
                  <a
                    href={article.sourceUrl}
                    className="flex items-start gap-2 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <span className="text-sky-500 font-bold text-sm min-w-[16px]">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#e00000] leading-snug">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{article.sourceName}</p>
                    </div>
                  </a>
                  {index < comments.length - 1 && <Separator className="my-0" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

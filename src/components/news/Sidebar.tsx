'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Flame, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TrendingTopic, NewsArticle } from './types';

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function TrendingItem({ topic, index }: { topic: TrendingTopic; index: number }) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
      <span className="text-sm font-bold text-gray-400 w-5 text-center flex-shrink-0 mt-0.5">
        {index + 1}
      </span>
      <p className="text-[13px] font-medium text-gray-700 group-hover:text-[#e00000] transition-colors line-clamp-2 leading-snug overflow-hidden">
        {topic.topic}
      </p>
    </div>
  );
}

function PopularArticle({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-2.5 border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-2.5">
        <span className="text-sm font-bold text-gray-400 w-5 text-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-[13px] font-medium text-gray-700 group-hover:text-[#e00000] transition-colors line-clamp-2 leading-snug break-words">
            {article.title}
          </p>
          <p className="text-[11px] text-gray-400 mt-1 truncate">
            {article.sourceName} &middot; {getTimeAgo(article.publishedAt)}
          </p>
        </div>
      </div>
    </a>
  );
}

export function Sidebar() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [popularArticles, setPopularArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSidebarData() {
      try {
        const trendingRes = await fetch('/api/news/trending');
        if (trendingRes.ok) {
          const trendingData = await trendingRes.json();
          setTrendingTopics(trendingData.topics || []);
        }

        const popularRes = await fetch('/api/news?category=berita');
        if (popularRes.ok) {
          const popularData = await popularRes.json();
          setPopularArticles((popularData.articles || []).slice(0, 5));
        }
      } catch {
        setTrendingTopics([
          { id: 't1', topic: 'Pemilu 2024: Hasil Rekapitulasi Suara', count: 95 },
          { id: 't2', topic: 'Timnas Indonesia di Piala Asia', count: 82 },
          { id: 't3', topic: 'Harga Emas Hari Ini Mencapai Rekor', count: 71 },
          { id: 't4', topic: 'Elon Musk Kunjungi Indonesia', count: 65 },
          { id: 't5', topic: 'Startup Unicorn Baru dari Indonesia', count: 58 },
        ]);
        setPopularArticles([
          { id: 'p1', title: 'Pemerintah Luncurkan Program Digital Nasional', summary: '', sourceUrl: '#', sourceName: 'DetikNews', imageUrl: '', category: 'berita', publishedAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 'p2', title: 'Bank Indonesia Pertahankan Suku Bunga Acuan', summary: '', sourceUrl: '#', sourceName: 'DetikFinance', imageUrl: '', category: 'ekonomi', publishedAt: new Date(Date.now() - 7200000).toISOString() },
          { id: 'p3', title: 'Timnas Indonesia Lolos ke Semifinal Piala Asia', summary: '', sourceUrl: '#', sourceName: 'DetikSport', imageUrl: '', category: 'olahraga', publishedAt: new Date(Date.now() - 10800000).toISOString() },
          { id: 'p4', title: 'Startup AI Bandung Raih Penghargaan Internasional', summary: '', sourceUrl: '#', sourceName: 'DetikInet', imageUrl: '', category: 'teknologi', publishedAt: new Date(Date.now() - 14400000).toISOString() },
          { id: 'p5', title: 'Film Indonesia Masuk Nominasi Festival Cannes', summary: '', sourceUrl: '#', sourceName: 'DetikHot', imageUrl: '', category: 'hiburan', publishedAt: new Date(Date.now() - 18000000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchSidebarData();
  }, []);

  if (loading) {
    return (
      <aside className="w-full">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Skeleton className="h-6 w-32 mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full flex flex-col gap-4">
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white shadow-sm border border-gray-100 h-9">
          <TabsTrigger
            value="trending"
            className="text-[11px] data-[state=active]:bg-[#e00000] data-[state=active]:text-white"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="text-[11px] data-[state=active]:bg-[#e00000] data-[state=active]:text-white"
          >
            <Flame className="w-3 h-3 mr-1" />
            Terpopuler
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-[11px] data-[state=active]:bg-[#e00000] data-[state=active]:text-white"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Komentar
          </TabsTrigger>
        </TabsList>

        {/* Trending Topics */}
        <TabsContent value="trending">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#e00000]" />
                <h3 className="font-bold text-xs text-gray-900">Topik Trending</h3>
              </div>
              <Badge variant="secondary" className="text-[9px] bg-gray-100 text-gray-500 px-1.5">
                LIVE
              </Badge>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {trendingTopics.length > 0 ? (
                trendingTopics.map((topic, index) => (
                  <TrendingItem key={topic.id} topic={topic} index={index} />
                ))
              ) : (
                <p className="text-center py-4 text-gray-400 text-xs">Belum ada topik trending</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Most Popular */}
        <TabsContent value="popular">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <h3 className="font-bold text-xs text-gray-900">Terpopuler</h3>
              </div>
              <Badge variant="secondary" className="text-[9px] bg-orange-50 text-orange-600 px-1.5">
                HOT
              </Badge>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {popularArticles.length > 0 ? (
                popularArticles.map((article, index) => (
                  <PopularArticle key={article.id} article={article} index={index} />
                ))
              ) : (
                <p className="text-center py-4 text-gray-400 text-xs">Belum ada artikel populer</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Most Comments */}
        <TabsContent value="comments">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="font-bold text-xs text-gray-900">Komentar Terbanyak</h3>
              </div>
              <Badge variant="secondary" className="text-[9px] bg-blue-50 text-blue-600 px-1.5">
                BAHAS
              </Badge>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {popularArticles.length > 0 ? (
                popularArticles.map((article, index) => (
                  <PopularArticle key={article.id} article={article} index={index} />
                ))
              ) : (
                <p className="text-center py-4 text-gray-400 text-xs">Belum ada artikel dengan komentar</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>


      {/* Info Box */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3.5 border border-red-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#e00000] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">DN</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-gray-900">DetikNews App</h4>
            <p className="text-[10px] text-gray-500">Berita terkini di genggaman Anda</p>
          </div>
        </div>
        <p className="text-[11px] text-gray-600 mb-2.5 leading-relaxed">
          Dapatkan notifikasi berita breaking dan topik trending langsung di smartphone Anda.
        </p>
        <button className="w-full py-1.5 bg-[#e00000] hover:bg-red-700 text-white text-[11px] font-medium rounded-lg transition-colors">
          Download Sekarang
        </button>
      </div>
    </aside>
  );
}

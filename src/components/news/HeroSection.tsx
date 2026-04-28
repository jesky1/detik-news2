'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from './types';
import { categoryColors, categoryLabels } from './types';

// Shared cache untuk hindari dobel-fetch antar komponen
let sharedHeadlines: { headlines: NewsArticle[]; breaking: NewsArticle[] } | null = null;
let headlinesPromise: Promise<{ headlines: NewsArticle[]; breaking: NewsArticle[] }> | null = null;

async function getSharedHeadlines() {
  if (sharedHeadlines) return sharedHeadlines;
  if (headlinesPromise) return headlinesPromise;
  
  headlinesPromise = fetch('/api/news/headlines')
    .then(res => res.ok ? res.json() : { headlines: [], breaking: [] })
    .then(data => {
      sharedHeadlines = {
        headlines: (data.headlines || []).slice(0, 4),
        breaking: (data.breaking || []).slice(0, 5),
      };
      return sharedHeadlines;
    })
    .catch(() => {
      sharedHeadlines = { headlines: [], breaking: [] };
      return sharedHeadlines;
    });
  
  return headlinesPromise;
}

// Fallback data
const fallbackBreaking = [
  { id: 'b1', title: 'Presiden umumkan paket kebijakan ekonomi baru untuk masyarakat', summary: '', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
  { id: 'b2', title: 'Timnas Indonesia lolos ke babak semifinal Piala Asia 2025', summary: '', sourceUrl: '#', sourceName: 'DetikSport', category: 'olahraga', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
  { id: 'b3', title: 'Rupiah menguat terhadap dolar AS di perdagangan hari ini', summary: '', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
];

const fallbackHeadlines = [
  { id: 'h1', title: 'Pemerintah Luncurkan Program Digital Nasional untuk Percepat Transformasi Ekonomi', summary: 'Program ini bertujuan mempercepat adopsi teknologi digital.', imageUrl: 'https://picsum.photos/seed/hero1/800/500', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
  { id: 'h2', title: 'Bank Indonesia Pertahankan Suku Bunga Acuan', summary: 'BI mempertahankan suku bunga di level 5,75%.', imageUrl: 'https://picsum.photos/seed/hero2/800/500', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: true, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'h3', title: 'Startup AI Bandung Raih Penghargaan di Silicon Valley', summary: 'Nusantara AI menang kompetisi inovasi teknologi.', imageUrl: 'https://picsum.photos/seed/hero3/800/500', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: true, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'h4', title: 'Garuda Indonesia Tambah Rute Penerbangan ke Eropa Timur', summary: 'Maskapai nasional perluas jaringan penerbangan.', imageUrl: 'https://picsum.photos/seed/hero4/800/500', sourceUrl: '#', sourceName: 'DetikNews', category: 'internasional', isHeadline: true, isBreaking: false, publishedAt: new Date().toISOString() },
];

export function BreakingTicker() {
  const [headlines, setHeadlines] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedHeadlines().then(data => {
      const breaking = data.breaking.length > 0 ? data.breaking : fallbackBreaking;
      setHeadlines(breaking);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#e00000] h-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4">
          <Skeleton className="h-3 w-72 bg-red-400" />
        </div>
      </div>
    );
  }

  if (headlines.length === 0) return null;

  const tickerText = headlines.map((h) => h.title).join('  \u2022  ');

  return (
    <div className="bg-[#e00000] h-8 flex items-center overflow-hidden">
      <div className="flex items-center h-full flex-shrink-0">
        <div className="bg-[#b00000] px-3 h-full flex items-center gap-1">
          <Zap className="h-3 w-3 text-white fill-white" />
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">Breaking</span>
        </div>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <div className="animate-ticker whitespace-nowrap flex items-center h-8">
          <span className="text-white text-xs font-medium px-4">
            {tickerText}
          </span>
          <span className="text-white text-xs font-medium px-4">
            {tickerText}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedHeadlines().then(data => {
      const headlines = data.headlines.length > 0 ? data.headlines : fallbackHeadlines;
      setArticles(headlines);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-3">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-3">
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
      {/* Featured Article */}
      {featured && (
        <a
          href={featured.sourceUrl}
          className="lg:col-span-3 group relative overflow-hidden rounded-xl bg-gray-900 block"
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={featured.imageUrl || 'https://picsum.photos/seed/default/800/500'}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
            <Badge className={`${categoryColors[featured.category] || 'bg-red-600'} text-white border-0 mb-2 text-[10px]`}>
              {categoryLabels[featured.category] || featured.category}
            </Badge>
            <h2 className="text-white text-base md:text-xl font-bold leading-tight mb-1 group-hover:text-[#e00000] transition-colors line-clamp-2">
              {featured.title}
            </h2>
            <div className="flex items-center gap-2 text-gray-300 text-[11px]">
              <span>{featured.sourceName}</span>
              <span>&middot;</span>
              <span>{new Date(featured.publishedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </a>
      )}

      {/* Side Articles */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {sideArticles.map((article) => (
          <a
            key={article.id}
            href={article.sourceUrl}
            className="group relative overflow-hidden rounded-xl bg-gray-900 min-h-0"
          >
            <div className="aspect-[16/9] lg:aspect-video overflow-hidden">
              <img
                src={article.imageUrl || 'https://picsum.photos/seed/default/400/250'}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 lg:p-3">
              <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 mb-1.5 text-[9px]`}>
                {categoryLabels[article.category] || article.category}
              </Badge>
              <h3 className="text-white text-xs lg:text-sm font-bold leading-tight group-hover:text-[#e00000] transition-colors line-clamp-2">
                {article.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from './types';
import { categoryColors, categoryLabels } from './types';

export function HeroSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const res = await fetch('/api/news/headlines');
        if (res.ok) {
          const data = await res.json();
          // API returns { headlines, breaking } - combine for hero section
          const headlines = data.headlines || [];
          const breaking = data.breaking || [];
          const combined = [...headlines, ...breaking].slice(0, 4);
          setArticles(combined.length > 0 ? combined : []);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch {
        // Fallback data
        setArticles([
          {
            id: '1',
            title: 'Pemerintah Luncurkan Program Digital Nasional untuk Percepat Transformasi Ekonomi',
            summary: 'Program ini bertujuan mempercepat adopsi teknologi digital di seluruh sektor ekonomi Indonesia, termasuk UMKM dan pendidikan.',
            imageUrl: 'https://picsum.photos/seed/hero1/800/500',
            sourceUrl: '#',
            sourceName: 'DetikNews',
            category: 'berita',
            isHeadline: true,
            isBreaking: true,
            publishedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Bank Indonesia Pertahankan Suku Bunga di Tengah Ketidakpastian Global',
            summary: 'BI memutuskan untuk mempertahankan suku bunga acuan di level 5,75% untuk menjaga stabilitas ekonomi.',
            imageUrl: 'https://picsum.photos/seed/hero2/800/500',
            sourceUrl: '#',
            sourceName: 'DetikFinance',
            category: 'ekonomi',
            isHeadline: true,
            isBreaking: false,
            publishedAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Startup AI Asal Bandung Raih Penghargaan di Silicon Valley',
            summary: 'Nusantara AI berhasil memenangkan kompetisi inovasi teknologi tingkat internasional.',
            imageUrl: 'https://picsum.photos/seed/hero3/800/500',
            sourceUrl: '#',
            sourceName: 'DetikInet',
            category: 'teknologi',
            isHeadline: true,
            isBreaking: false,
            publishedAt: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'Garuda Indonesia Tambah Rute Penerbangan ke Eropa Timur',
            summary: 'Maskapai nasional memperluas jaringan penerbangan internasionalnya ke kota-kota baru.',
            imageUrl: 'https://picsum.photos/seed/hero4/800/500',
            sourceUrl: '#',
            sourceName: 'DetikNews',
            category: 'internasional',
            isHeadline: true,
            isBreaking: false,
            publishedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchHeadlines();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-full h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Main Featured Article */}
      {featured && (
        <a
          href={featured.sourceUrl}
          className="lg:col-span-3 group relative overflow-hidden rounded-xl bg-gray-900 block"
        >
          <div className="aspect-video lg:aspect-[4/3] overflow-hidden">
            <img
              src={featured.imageUrl || 'https://picsum.photos/seed/default/800/500'}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <Badge className={`${categoryColors[featured.category] || 'bg-red-600'} text-white border-0 mb-3 text-xs`}>
              {categoryLabels[featured.category] || featured.category}
            </Badge>
            <h2 className="text-white text-lg md:text-2xl font-bold leading-tight mb-2 group-hover:text-[#e00000] transition-colors line-clamp-3">
              {featured.title}
            </h2>
            <p className="text-gray-300 text-sm hidden md:block line-clamp-2 mb-2">
              {featured.summary}
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="font-medium">{featured.sourceName}</span>
              <span>•</span>
              <span>{new Date(featured.publishedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </a>
      )}

      {/* Side Articles */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {sideArticles.map((article) => (
          <a
            key={article.id}
            href={article.sourceUrl}
            className="group relative overflow-hidden rounded-xl bg-gray-900 flex lg:flex-col flex-row h-36 lg:h-auto"
          >
            <div className="w-1/3 lg:w-full lg:aspect-video overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl || 'https://picsum.photos/seed/default/400/250'}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
              <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 mb-2 text-[10px] lg:text-xs`}>
                {categoryLabels[article.category] || article.category}
              </Badge>
              <h3 className="text-white text-sm lg:text-base font-bold leading-tight group-hover:text-[#e00000] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-[10px] lg:text-xs mt-1">
                <span>{article.sourceName}</span>
                <span>•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

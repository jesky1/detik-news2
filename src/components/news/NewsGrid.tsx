'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ExternalLink, X } from 'lucide-react';
import { useNewsStore } from '@/lib/news-store';
import type { NewsArticle } from './types';
import { categoryColors, categoryLabels } from './types';

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
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function NewsGrid() {
  const { activeCategory, searchQuery, setSearchQuery } = useNewsStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isSearchMode = searchQuery && searchQuery.trim().length > 0;

  const fetchNews = useCallback(async (category: string, showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch {
      setArticles([
        {
          id: 'fb1', title: 'Pemerintah Luncurkan Program Digital Nasional untuk Percepat Transformasi Ekonomi',
          summary: 'Program ini bertujuan mempercepat adopsi teknologi digital di seluruh sektor ekonomi Indonesia.',
          imageUrl: 'https://picsum.photos/seed/fallback1/800/400', sourceUrl: '#', sourceName: 'DetikNews',
          category: 'berita', publishedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'fb2', title: 'Bank Indonesia Pertahankan Suku Bunga di Tengah Ketidakpastian Global',
          summary: 'BI memutuskan untuk mempertahankan suku bunga acuan di level 5,75%.',
          imageUrl: 'https://picsum.photos/seed/fallback2/800/400', sourceUrl: '#', sourceName: 'DetikFinance',
          category: 'ekonomi', publishedAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'fb3', title: 'Timnas Indonesia Lolos ke Babak Semifinal Piala Asia 2025',
          summary: 'Pencapaian bersejarah bagi sepak bola Indonesia di kancah internasional.',
          imageUrl: 'https://picsum.photos/seed/fallback3/800/400', sourceUrl: '#', sourceName: 'DetikSport',
          category: 'olahraga', publishedAt: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: 'fb4', title: 'Startup AI Asal Bandung Raih Penghargaan di Silicon Valley',
          summary: 'Nusantara AI berhasil memenangkan kompetisi inovasi teknologi tingkat internasional.',
          imageUrl: 'https://picsum.photos/seed/fallback4/800/400', sourceUrl: '#', sourceName: 'DetikInet',
          category: 'teknologi', publishedAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: 'fb5', title: 'Film Indonesia Masuk Nominasi Festival Film Cannes 2025',
          summary: 'Film karya sutradara muda Indonesia berhasil menarik perhatian dunia perfilman.',
          imageUrl: 'https://picsum.photos/seed/fallback5/800/400', sourceUrl: '#', sourceName: 'DetikHot',
          category: 'hiburan', publishedAt: new Date(Date.now() - 18000000).toISOString(),
        },
        {
          id: 'fb6', title: 'KTT G20 Bahas Krisis Iklim dan Transformasi Energi Global',
          summary: 'Para pemimpin dunia sepakat untuk mempercepat transisi menuju energi bersih.',
          imageUrl: 'https://picsum.photos/seed/fallback6/800/400', sourceUrl: '#', sourceName: 'DetikNews',
          category: 'internasional', publishedAt: new Date(Date.now() - 21600000).toISOString(),
        },
      ]);
    } finally {
      if (showLoader) setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchSearch = useCallback(async (query: string, showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      } else {
        setArticles([]);
      }
    } catch {
      setArticles([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Fetch data: jika ada searchQuery pakai search, kalau tidak pakai category
  useEffect(() => {
    if (isSearchMode) {
      fetchSearch(searchQuery);
    } else {
      fetchNews(activeCategory);
    }
  }, [activeCategory, searchQuery, isSearchMode, fetchNews, fetchSearch]);

  const handleRefresh = () => {
    if (isSearchMode) {
      fetchSearch(searchQuery, false);
    } else {
      fetchNews(activeCategory, false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Judul section
  const sectionTitle = isSearchMode
    ? `Hasil pencarian: "${searchQuery}"`
    : (categoryLabels[activeCategory] || 'Berita Terkini');

  if (loading) {
    return (
      <section id="news-grid-section">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section id="news-grid-section">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{sectionTitle}</h2>
            {isSearchMode && (
              <button
                onClick={handleClearSearch}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#e00000] transition-colors"
              >
                <X className="w-3 h-3" />
                Hapus filter
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Berita terbaru untuk Anda</p>
        </div>
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            {isSearchMode ? 'Tidak ditemukan' : 'Tidak ada berita'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {isSearchMode ? 'Coba gunakan kata kunci yang berbeda' : 'Belum ada artikel untuk kategori ini'}
          </p>
          {isSearchMode && (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-[#e00000] hover:text-red-700 text-sm font-medium transition-colors"
            >
              Kembali ke berita utama
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="mt-4 text-[#e00000] hover:text-red-700 text-sm font-medium transition-colors block mx-auto"
          >
            Coba lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="news-grid-section">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{sectionTitle}</h2>
            {isSearchMode && (
              <button
                onClick={handleClearSearch}
                className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#e00000] px-2.5 py-1 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
                Hapus filter
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {articles.length} artikel ditemukan
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="text-gray-500 hover:text-[#e00000] transition-colors"
          title="Refresh berita"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <a
            key={article.id}
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/400`}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 text-[10px]`}>
                  {categoryLabels[article.category] || article.category}
                </Badge>
              </div>
              {index === 0 && !isSearchMode && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-[#e00000] text-white border-0 text-[10px] animate-pulse">
                    TERBARU
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#e00000] transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-600">{article.sourceName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(article.publishedAt)}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button
          onClick={handleRefresh}
          disabled={loadingMore}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loadingMore ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memuat...
            </>
          ) : (
            'Muat Lebih Banyak'
          )}
        </button>
      </div>
    </section>
  );
}

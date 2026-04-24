'use client';

import { useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNewsStore } from '@/lib/news-store';
import { categoryColors, categoryLabels } from './types';
import type { NewsArticle } from './types';

export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery } = useNewsStore();
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) return;

    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/news/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data.articles) ? data.articles : []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white">
      {/* Search Header */}
      <div className="bg-[#0c0c0c] px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari berita..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-9 h-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {searchQuery && !loading && results.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Ditemukan {results.length} hasil untuk &quot;{searchQuery}&quot;
          </p>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-32 h-20 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-1">
            {results.map((article, index) => (
              <a
                key={index}
                href={article.sourceUrl}
                className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={article.imageUrl || 'https://picsum.photos/seed/search/200/140'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 text-[10px] px-1.5 py-0 mb-1.5`}>
                    {categoryLabels[article.category] || article.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#e00000] transition-colors text-sm leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
                    <span>{article.sourceName}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && searchQuery && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">Tidak ada hasil</p>
            <p className="text-sm text-gray-400 mt-1">
              Coba kata kunci yang berbeda untuk &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">Cari Berita</p>
            <p className="text-sm text-gray-400 mt-1">Ketik kata kunci untuk mencari berita terkini</p>
          </div>
        )}
      </div>
    </div>
  );
}

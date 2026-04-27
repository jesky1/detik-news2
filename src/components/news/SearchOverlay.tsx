'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNewsStore } from '@/lib/news-store';
import type { NewsArticle } from './types';
import { categoryColors, categoryLabels } from './types';
import { Badge } from '@/components/ui/badge';

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

const quickSearches = [
  'Berita hari ini',
  'Ekonomi Indonesia',
  'Timnas Indonesia',
  'Teknologi AI',
  'Gempa terkini',
];

export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery } = useNewsStore();
  const [localQuery, setLocalQuery] = useState('');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setResults([]);
      setHasSearched(false);
      setLocalQuery('');
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, setSearchQuery]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.articles || []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setLocalQuery(value);
    setSearchQuery(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(value);
      }, 500);
    } else if (value.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      performSearch(localQuery);
    }
  };

  const handleQuickSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    performSearch(query);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />

      {/* Search Container */}
      <div className="relative z-10 max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="flex items-center p-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Cari berita, topik, atau peristiwa..."
              className="flex-1 px-3 py-2 text-gray-900 placeholder-gray-400 bg-transparent outline-none text-base"
            />
            {isSearching && (
              <Loader2 className="w-5 h-5 text-[#e00000] animate-spin flex-shrink-0" />
            )}
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  setResults([]);
                  setHasSearched(false);
                  inputRef.current?.focus();
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 text-xs font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              ESC
            </button>
          </form>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isSearching ? (
              <div className="p-6 text-center">
                <Loader2 className="w-8 h-8 text-[#e00000] animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Mencari berita...</p>
              </div>
            ) : hasSearched && results.length > 0 ? (
              <div className="divide-y divide-gray-50">
                <div className="px-4 py-2.5 bg-gray-50/50">
                  <p className="text-xs text-gray-500">
                    Ditemukan {results.length} hasil untuk &ldquo;{localQuery}&rdquo;
                  </p>
                </div>
                {results.map((article) => (
                  <a
                    key={article.id || article.sourceUrl}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 text-[9px]`}>
                          {categoryLabels[article.category] || article.category}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{article.sourceName}</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#e00000] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                      {article.summary && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{article.summary}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(article.publishedAt)}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#e00000] transition-colors flex-shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-300 mb-2">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">Tidak ditemukan</p>
                <p className="text-gray-400 text-xs mt-1">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-xs text-gray-500 font-medium mb-3 px-1">
                  Pencarian Populer
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSearches.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleQuickSearch(query)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              Tekan <kbd className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-[9px] font-mono">Enter</kbd> untuk mencari
            </p>
            <p className="text-[10px] text-gray-400">
              <kbd className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-[9px] font-mono">ESC</kbd> untuk menutup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

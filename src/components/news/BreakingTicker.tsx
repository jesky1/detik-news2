'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from './types';

export function BreakingTicker() {
  const [headlines, setHeadlines] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const res = await fetch('/api/news/headlines');
        if (res.ok) {
          const data = await res.json();
          // API returns { headlines, breaking } - use breaking for ticker
          const breakingNews = data.breaking || data.headlines || data;
          setHeadlines(Array.isArray(breakingNews) ? breakingNews : []);
        } else {
          // Fallback data
          setHeadlines([
            { id: '1', title: 'Presiden umumkan paket kebijakan ekonomi baru untuk masyarakat', summary: '', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
            { id: '2', title: 'Timnas Indonesia lolos ke babak semifinal Piala Asia 2025', summary: '', sourceUrl: '#', sourceName: 'DetikSport', category: 'olahraga', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
            { id: '3', title: 'Rupiah menguat terhadap dolar AS di perdagangan hari ini', summary: '', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
            { id: '4', title: 'Startup teknologi asal Indonesia raih pendanaan seri B senilai $50 juta', summary: '', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
            { id: '5', title: 'Film Indonesia masuk nominasi Festival Film Cannes 2025', summary: '', sourceUrl: '#', sourceName: 'DetikHot', category: 'hiburan', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
          ]);
        }
      } catch {
        setHeadlines([
          { id: '1', title: 'Presiden umumkan paket kebijakan ekonomi baru untuk masyarakat', summary: '', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
          { id: '2', title: 'Timnas Indonesia lolos ke babak semifinal Piala Asia 2025', summary: '', sourceUrl: '#', sourceName: 'DetikSport', category: 'olahraga', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
          { id: '3', title: 'Rupiah menguat terhadap dolar AS di perdagangan hari ini', summary: '', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: true, isBreaking: true, publishedAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchHeadlines();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#e00000] h-9 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4">
          <Skeleton className="h-4 w-96 bg-red-400" />
        </div>
      </div>
    );
  }

  if (headlines.length === 0) return null;

  const tickerText = headlines.map((h) => h.title).join('  •  ');

  return (
    <div className="bg-[#e00000] h-9 flex items-center overflow-hidden">
      <div className="flex items-center h-full flex-shrink-0">
        <div className="bg-[#b00000] px-4 h-full flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-white fill-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Breaking</span>
        </div>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <div className="animate-ticker whitespace-nowrap flex items-center h-9">
          <span className="text-white text-sm font-medium px-4">
            {tickerText}
          </span>
          <span className="text-white text-sm font-medium px-4">
            {tickerText}
          </span>
        </div>
      </div>
    </div>
  );
}

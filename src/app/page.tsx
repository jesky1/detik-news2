'use client';

import { useEffect } from 'react';
import { Header } from '@/components/news/Header';
import { BreakingTicker, HeroSection } from '@/components/news/HeroSection';
import { NewsGrid } from '@/components/news/NewsGrid';
import { Sidebar } from '@/components/news/Sidebar';
import { Footer } from '@/components/news/Footer';
import { SearchOverlay } from '@/components/news/SearchOverlay';

function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) { /* ignore */ }
  }, []);
  return (
    <div className="w-full flex justify-center py-3">
      <ins className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-6112263998203283"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6112263998203283"
        crossOrigin="anonymous"
      />
      <AdSlot slot="header-banner" />
      <Header />
      <BreakingTicker />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <HeroSection />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NewsGrid />
            </div>
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      <AdSlot slot="footer-banner" />
      <Footer />
      <SearchOverlay />
    </div>
  );
}

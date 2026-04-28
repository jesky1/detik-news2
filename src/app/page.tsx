'use client';

import { Header } from '@/components/news/Header';
import { BreakingTicker, HeroSection } from '@/components/news/HeroSection';
import { NewsGrid } from '@/components/news/NewsGrid';
import { Sidebar } from '@/components/news/Sidebar';
import { Footer } from '@/components/news/Footer';
import { SearchOverlay } from '@/components/news/SearchOverlay';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
      <Footer />
      <SearchOverlay />
    </div>
  );
}

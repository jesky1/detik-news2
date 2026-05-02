'use client';

import { useEffect, useRef } from 'react';
import { Header } from '@/components/news/Header';
import { BreakingTicker } from '@/components/news/BreakingTicker';
import { HeroSection } from '@/components/news/HeroSection';
import { NewsGrid } from '@/components/news/NewsGrid';
import { Sidebar } from '@/components/news/Sidebar';
import { Footer } from '@/components/news/Footer';
import { SearchOverlay } from '@/components/news/SearchOverlay';

// Google AdSense Inline Ad Slot Component
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
  const hpfContainerRef = useRef<HTMLDivElement>(null);
  const hpfMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PropellerAds - Popunder/Interstitial Script
    const popunderScript = document.createElement('script');
    popunderScript.src = 'https://pl29322274.profitablecpmratenetwork.com/8b/38/fb/8b38fb8f148777ea9ae4d4c6bc484491.js';
    document.head.appendChild(popunderScript);

    // PropellerAds - Banner Ad Script (with data-cfasync)
    const bannerScript = document.createElement('script');
    bannerScript.async = true;
    bannerScript.setAttribute('data-cfasync', 'false');
    bannerScript.src = 'https://pl29322275.profitablecpmratenetwork.com/b4b4c1b11c16cf82c22643feb7c778df/invoke.js';
    document.head.appendChild(bannerScript);

    // PropellerAds - Native Ad Script
    const nativeScript = document.createElement('script');
    nativeScript.src = 'https://www.profitablecpmratenetwork.com/rgzujvyj94?key=ac16813c82efd90b874531bf30d3b010';
    document.head.appendChild(nativeScript);

    // HighPerformanceFormat - Mobile Banner 320x50
    if (hpfMobileRef.current) {
      const mobileOptionsScript = document.createElement('script');
      mobileOptionsScript.textContent = `
        atOptions = {
          'key' : '6e22dfa7e4cacdba7bc6a92bad216a5d',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      hpfMobileRef.current.appendChild(mobileOptionsScript);

      const mobileInvokeScript = document.createElement('script');
      mobileInvokeScript.src = 'https://www.highperformanceformat.com/6e22dfa7e4cacdba7bc6a92bad216a5d/invoke.js';
      hpfMobileRef.current.appendChild(mobileInvokeScript);
    }

    // HighPerformanceFormat - Leaderboard Banner 728x90
    if (hpfContainerRef.current) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.textContent = `
        atOptions = {
          'key' : '3e9e911a7c290fe3b98cff284296c889',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      hpfContainerRef.current.appendChild(atOptionsScript);

      const invokeScript = document.createElement('script');
      invokeScript.src = 'https://www.highperformanceformat.com/3e9e911a7c290fe3b98cff284296c889/invoke.js';
      hpfContainerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <BreakingTicker />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <HeroSection />

          {/* PropellerAds Banner Ad Container */}
          <div className="my-4 flex justify-center">
            <div id="container-b4b4c1b11c16cf82c22643feb7c778df"></div>
          </div>

          {/* HighPerformanceFormat - Leaderboard Banner 728x90 */}
          <div className="my-4 flex justify-center">
            <div ref={hpfContainerRef}></div>
          </div>

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
      {/* HighPerformanceFormat - Mobile Banner 320x50 */}
      <div className="my-2 flex justify-center">
        <div ref={hpfMobileRef}></div>
      </div>

      <Footer />
      <SearchOverlay />
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

// ============================================
// GOOGLE ADSENSE - KONFIGURASI
// ============================================
// Ganti PUBLISHER_ID di bawah dengan ID AdSense kamu
// Format: ca-pub-XXXXXXXXXXXXXXXX
// Daftar di: https://www.google.com/adsense/
// ============================================
const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

interface AdBannerProps {
  /** Format/ukuran iklan */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  /** Slot iklan unik (harus beda tiap komponen) */
  slot?: string;
  /** Ukuran responsif */
  responsive?: boolean;
  /** Class tambahan */
  className?: string;
  /** Label untuk monitoring */
  label?: string;
}

export function AdBanner({
  format = 'auto',
  slot = 'default',
  responsive = true,
  className = '',
  label = 'Iklan',
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adInsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Jangan push ads di development mode
    if (process.env.NODE_ENV === 'development') return;
    if (PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX') return;

    try {
      // Bersihkan iklan lama jika ada
      if (adInsRef.current) {
        adInsRef.current.remove();
        adInsRef.current = null;
      }

      if (adRef.current) {
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        if (responsive) {
          ins.setAttribute('data-ad-client', PUBLISHER_ID);
          ins.setAttribute('data-ad-slot', slot);
          ins.setAttribute('data-ad-format', format);
          ins.setAttribute('data-full-width-responsive', 'true');
        } else {
          ins.setAttribute('data-ad-client', PUBLISHER_ID);
          ins.setAttribute('data-ad-slot', slot);
          ins.setAttribute('data-ad-format', format);
        }
        adRef.current.innerHTML = '';
        adRef.current.appendChild(ins);
        adInsRef.current = ins;

        // Push ke AdSense
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.warn('AdSense push failed:', e);
        }
      }
    } catch (e) {
      console.warn('AdSense init failed:', e);
    }

    return () => {
      if (adInsRef.current) {
        adInsRef.current.remove();
        adInsRef.current = null;
      }
    };
  }, [format, slot, responsive]);

  // Development mode: tampilkan placeholder
  const isDev = process.env.NODE_ENV === 'development';
  const isPlaceholder = isDev || PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX';

  if (isPlaceholder) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px',
            }} />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1 py-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center px-4">
              {isDev ? 'Iklan AdSense (dev mode)' : 'Ganti NEXT_PUBLIC_ADSENSE_ID di .env.local'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div ref={adRef} />
    </div>
  );
}

// ============================================
// AD SENSE HEADER BANNER - Banner atas
// ============================================
export function AdHeaderBanner() {
  return (
    <div className="w-full bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <AdBanner
          format="horizontal"
          slot="header-banner"
          className="min-h-[90px]"
          label="Banner Atas"
        />
      </div>
    </div>
  );
}

// ============================================
// IN-ARTICLE AD - Iklan di antara artikel
// ============================================
export function AdInArticle({ index = 0 }: { index?: number }) {
  return (
    <div className="my-4">
      <AdBanner
        format="fluid"
        slot={`in-article-${index}`}
        className="min-h-[250px]"
        label="Iklan Artikel"
      />
    </div>
  );
}

// ============================================
// SIDEBAR AD - Iklan sidebar
// ============================================
export function AdSidebar({ index = 0 }: { index?: number }) {
  return (
    <div className="mt-4">
      <AdBanner
        format="rectangle"
        slot={`sidebar-${index}`}
        className="min-h-[250px]"
        label="Iklan Sidebar"
      />
    </div>
  );
}

// ============================================
// FOOTER AD - Iklan footer
// ============================================
export function AdFooterBanner() {
  return (
    <div className="w-full bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner
          format="horizontal"
          slot="footer-banner"
          className="min-h-[90px]"
          label="Banner Bawah"
        />
      </div>
    </div>
  );
}

// ============================================
// ADSENSE SCRIPT - Tempatkan di layout.tsx
// ============================================
export function AdSenseScript() {
  if (process.env.NODE_ENV === 'development') return null;
  if (PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX') return null;

  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
        crossOrigin="anonymous"
      />
    </>
  );
}

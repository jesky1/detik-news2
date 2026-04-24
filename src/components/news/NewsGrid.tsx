'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleCard } from './ArticleCard';
import { useNewsStore } from '@/lib/news-store';
import type { NewsArticle } from './types';

const categories = [
  { value: 'all', label: 'Semua' },
  { value: 'berita', label: 'Berita' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'internasional', label: 'Internasional' },
];

const fallbackArticles: NewsArticle[] = [
  { id: 'a1', title: 'Pemerintah Percepat Pembangunan Infrastruktur Digital di Daerah Tertinggal', summary: 'Program percepatan digitalisasi ini menargetkan 100 kabupaten untuk mendapatkan akses internet berkecepatan tinggi.', imageUrl: 'https://picsum.photos/seed/n1/400/225', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a2', title: 'IHSG Ditutup Menguat di Tengah Sentimen Positif Pasar Global', summary: 'Indeks Harga Saham Gabungan ditutup menguat 0,8% didorong oleh sektor perbankan dan komoditas.', imageUrl: 'https://picsum.photos/seed/n2/400/225', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a3', title: 'Film Horor Indonesia Pecahkan Rekor Box Office Weekend Pertama', summary: 'Film berjudul Kereta Terakhir berhasil meraih 5 juta penonton dalam tiga hari pertama penayangan.', imageUrl: 'https://picsum.photos/seed/n3/400/225', sourceUrl: '#', sourceName: 'DetikHot', category: 'hiburan', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a4', title: 'Atlet Badminton Indonesia Raih Emas di Kejuaraan Dunia Junior', summary: 'Pasangan ganda campuran Indonesia berhasil mengalahkan unggulan pertama asal Tiongkok di final.', imageUrl: 'https://picsum.photos/seed/n4/400/225', sourceUrl: '#', sourceName: 'DetikSport', category: 'olahraga', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a5', title: 'Perusahaan Ridesourcing Terbesar Luncurkan Fitur Kendaraan Listrik', summary: 'Fitur baru ini memungkinkan pengguna memilih kendaraan listrik untuk perjalanan yang lebih ramah lingkungan.', imageUrl: 'https://picsum.photos/seed/n5/400/225', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a6', title: 'KTT ASEAN Bahas Perdagangan Bebas dan Keamanan Maritim', summary: 'Para pemimpin ASEAN menyepakati kerangka kerja baru untuk memperkuat kerja sama ekonomi regional.', imageUrl: 'https://picsum.photos/seed/n6/400/225', sourceUrl: '#', sourceName: 'DetikNews', category: 'internasional', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a7', title: 'Kementerian PUPR Bangun 50 Ribu Unit Rumah Sederhana Sejahtera', summary: 'Program FLPP diperluas untuk memenuhi target penyediaan rumah bagi MBR hingga akhir 2025.', imageUrl: 'https://picsum.photos/seed/n7/400/225', sourceUrl: '#', sourceName: 'DetikNews', category: 'berita', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a8', title: 'OJK Perketat Regulasi Fintech Lending untuk Melindungi Peminjam', summary: 'Aturan baru mewajibkan platform fintech lending melakukan penilaian kelayakan kredit yang lebih ketat.', imageUrl: 'https://picsum.photos/seed/n8/400/225', sourceUrl: '#', sourceName: 'DetikFinance', category: 'ekonomi', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
  { id: 'a9', title: 'Peneliti Indonesia Kembangkan Alat Deteksi Dini Kanker dari AI', summary: 'Alat berbasis kecerdasan buatan ini mampu mendeteksi kanker dengan akurasi hingga 95 persen.', imageUrl: 'https://picsum.photos/seed/n9/400/225', sourceUrl: '#', sourceName: 'DetikInet', category: 'teknologi', isHeadline: false, isBreaking: false, publishedAt: new Date().toISOString() },
];

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NewsGrid() {
  const { activeCategory, setActiveCategory } = useNewsStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedCategories, setFetchedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        if (activeCategory === 'all') {
          // For "Semua" tab, fetch from just 3 categories to avoid rate limiting
          const fetchCats = ['berita', 'ekonomi', 'olahraga'];
          const results = await Promise.all(
            fetchCats.map(async (cat) => {
              try {
                const res = await fetch(`/api/news?category=${cat}`);
                if (res.ok) {
                  const data = await res.json();
                  return (data.articles || []) as NewsArticle[];
                }
                return [];
              } catch {
                return [];
              }
            })
          );
          const combined = results.flat().sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
          setArticles(combined.length > 0 ? combined : fallbackArticles);
        } else {
          const url = `/api/news?category=${activeCategory}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const articles = data.articles || data;
            setArticles(Array.isArray(articles) ? articles : []);
          } else {
            throw new Error('Failed to fetch');
          }
        }
      } catch {
        if (activeCategory === 'all') {
          setArticles(fallbackArticles);
        } else {
          const filtered = fallbackArticles.filter(a => a.category === activeCategory);
          setArticles(filtered.length > 0 ? filtered : fallbackArticles.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [activeCategory]);

  return (
    <section id="news-grid-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Berita Terkini</h2>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-gray-100 p-1 rounded-lg">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="data-[state=active]:bg-white data-[state=active]:text-[#e00000] data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            {loading ? (
              <LoadingSkeleton />
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Tidak ada berita</p>
                <p className="text-sm">Belum ada artikel untuk kategori ini</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

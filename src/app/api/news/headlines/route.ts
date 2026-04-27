import { NextResponse } from 'next/server';
import { fetchDetikHeadlines } from '@/lib/detik-rss';

export async function GET() {
  try {
    // Fetch real headlines from detik.com RSS
    const { headlines, breaking } = await fetchDetikHeadlines(8);

    return NextResponse.json({
      headlines: headlines.map((a, i) => ({
        id: `headline-${i}-${Date.now()}`,
        title: a.title,
        summary: a.summary,
        sourceUrl: a.sourceUrl,
        sourceName: a.sourceName,
        imageUrl: a.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(a.title.slice(0, 20))}/800/400`,
        category: 'berita',
        isHeadline: true,
        publishedAt: a.publishedAt,
      })),
      breaking: breaking.map((a, i) => ({
        id: `breaking-${i}-${Date.now()}`,
        title: a.title,
        summary: a.summary,
        sourceUrl: a.sourceUrl,
        sourceName: a.sourceName,
        imageUrl: a.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(a.title.slice(0, 20))}/800/400`,
        category: 'berita',
        isBreaking: true,
        publishedAt: a.publishedAt,
      })),
    });
  } catch (error) {
    console.error('[/api/news/headlines] Error fetching headlines:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil headline dari detik.com', headlines: [], breaking: [] },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fetchDetikNews } from '@/lib/detik-rss';

const VALID_CATEGORIES = ['all', 'berita', 'ekonomi', 'hiburan', 'olahraga', 'teknologi', 'internasional'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCategory = searchParams.get('category') || 'berita';
    const category = rawCategory === 'all' ? 'berita' : rawCategory;

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Valid categories: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // 1 request saja ke detik.com (sudah ada cache)
    const articles = await fetchDetikNews(category, 12);

    return NextResponse.json({
      articles: articles.map((a, i) => ({
        id: `detik-${category}-${i}-${Date.now()}`,
        title: a.title,
        summary: a.summary || a.title,
        sourceUrl: a.sourceUrl,
        sourceName: a.sourceName,
        imageUrl: a.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(a.title.slice(0, 20))}/800/400`,
        category: category,
        publishedAt: a.publishedAt,
      })),
      category,
    });
  } catch (error) {
    console.error('[/api/news] Error fetching news:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil berita dari detik.com', articles: [], category: 'berita' },
      { status: 500 }
    );
  }
}

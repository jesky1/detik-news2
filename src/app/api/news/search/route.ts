import { NextRequest, NextResponse } from 'next/server';
import { fetchDetikNews, searchDetikNews } from '@/lib/detik-rss';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }

    // First try searching within detik RSS feeds
    let articles = await searchDetikNews(q, 10);

    // If no results from search, fetch all categories and combine
    if (articles.length === 0) {
      const categories = ['berita', 'ekonomi', 'hiburan', 'olahraga', 'teknologi', 'internasional'];
      const allArticles = await Promise.all(
        categories.map((cat) => fetchDetikNews(cat, 5))
      );
      const merged = allArticles.flat();
      // Simple relevance: just return latest from all categories
      articles = merged.slice(0, 10);
    }

    return NextResponse.json({
      articles: articles.map((a, i) => ({
        id: `search-${i}-${Date.now()}`,
        title: a.title,
        summary: a.summary,
        sourceUrl: a.sourceUrl,
        sourceName: a.sourceName,
        imageUrl: a.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(a.title.slice(0, 20))}/800/400`,
        category: a.category,
        publishedAt: a.publishedAt,
      })),
    });
  } catch (error) {
    console.error('[/api/news/search] Error searching news:', error);
    return NextResponse.json({ articles: [] });
  }
}

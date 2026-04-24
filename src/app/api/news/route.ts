import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const categoryQueries: Record<string, string> = {
  berita: 'berita terbaru Indonesia hari ini',
  ekonomi: 'berita ekonomi Indonesia terbaru',
  hiburan: 'berita hiburan selebritis Indonesia terbaru',
  olahraga: 'berita olahraga Indonesia terbaru',
  teknologi: 'berita teknologi Indonesia terbaru',
  internasional: 'berita internasional terbaru',
};

const VALID_CATEGORIES = Object.keys(categoryQueries);
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'berita';

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Valid categories: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for cached results in DB (less than 30 minutes old)
    const cachedArticles = await db.newsArticle.findMany({
      where: {
        category,
        createdAt: { gte: new Date(Date.now() - CACHE_DURATION_MS) },
      },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });

    if (cachedArticles.length > 0) {
      return NextResponse.json({ articles: cachedArticles, category });
    }

    // Fetch fresh results from web search
    const zai = await ZAI.create();
    const searchQuery = categoryQueries[category];
    const results = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: 10,
      recency_days: 1,
    });

    // Store results in database
    const articles = await Promise.all(
      results.map(async (result: {
        url: string;
        name: string;
        snippet: string;
        host_name: string;
        date?: string;
      }) => {
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.name.slice(0, 20))}/800/400`;
        const publishedAt = result.date ? new Date(result.date) : new Date();

        const article = await db.newsArticle.create({
          data: {
            title: result.name,
            summary: result.snippet,
            sourceUrl: result.url,
            sourceName: result.host_name || 'detik.com',
            imageUrl,
            category,
            publishedAt,
          },
        });
        return article;
      })
    );

    return NextResponse.json({ articles, category });
  } catch (error) {
    console.error('[/api/news] Error fetching news:', error);

    // Fallback: return any cached results from DB regardless of age
    try {
      const fallbackCategory = new URL(request.url).searchParams.get('category') || 'berita';
      const fallbackArticles = await db.newsArticle.findMany({
        where: { category: fallbackCategory },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      });
      return NextResponse.json({ articles: fallbackArticles, category: fallbackCategory });
    } catch {
      return NextResponse.json({ articles: [], category: 'berita' });
    }
  }
}

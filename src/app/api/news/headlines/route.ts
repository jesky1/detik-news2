import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    // Check for cached headlines in DB
    const cachedHeadlines = await db.newsArticle.findMany({
      where: {
        isHeadline: true,
        createdAt: { gte: new Date(Date.now() - CACHE_DURATION_MS) },
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    });

    const cachedBreaking = await db.newsArticle.findMany({
      where: {
        isBreaking: true,
        createdAt: { gte: new Date(Date.now() - CACHE_DURATION_MS) },
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    });

    if (cachedHeadlines.length > 0 || cachedBreaking.length > 0) {
      return NextResponse.json({
        headlines: cachedHeadlines,
        breaking: cachedBreaking,
      });
    }

    // Fetch headlines from web search
    const zai = await ZAI.create();
    const headlineResults = await zai.functions.invoke('web_search', {
      query: 'berita utama headline Indonesia hari ini',
      num: 5,
      recency_days: 1,
    });

    const breakingResults = await zai.functions.invoke('web_search', {
      query: 'breaking news Indonesia terkini',
      num: 5,
      recency_days: 1,
    });

    // Store headline articles
    const headlines = await Promise.all(
      headlineResults.map(async (result: {
        url: string;
        name: string;
        snippet: string;
        host_name: string;
        date?: string;
      }) => {
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.name.slice(0, 20))}/800/400`;
        const publishedAt = result.date ? new Date(result.date) : new Date();

        return db.newsArticle.create({
          data: {
            title: result.name,
            summary: result.snippet,
            sourceUrl: result.url,
            sourceName: result.host_name || 'detik.com',
            imageUrl,
            category: 'berita',
            isHeadline: true,
            publishedAt,
          },
        });
      })
    );

    // Store breaking news articles
    const breaking = await Promise.all(
      breakingResults.map(async (result: {
        url: string;
        name: string;
        snippet: string;
        host_name: string;
        date?: string;
      }) => {
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.name.slice(0, 20))}/800/400`;
        const publishedAt = result.date ? new Date(result.date) : new Date();

        return db.newsArticle.create({
          data: {
            title: result.name,
            summary: result.snippet,
            sourceUrl: result.url,
            sourceName: result.host_name || 'detik.com',
            imageUrl,
            category: 'berita',
            isBreaking: true,
            publishedAt,
          },
        });
      })
    );

    return NextResponse.json({ headlines, breaking });
  } catch (error) {
    console.error('[/api/news/headlines] Error fetching headlines:', error);

    // Fallback: return any cached results from DB regardless of age
    try {
      const fallbackHeadlines = await db.newsArticle.findMany({
        where: { isHeadline: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      });
      const fallbackBreaking = await db.newsArticle.findMany({
        where: { isBreaking: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      });
      return NextResponse.json({ headlines: fallbackHeadlines, breaking: fallbackBreaking });
    } catch {
      return NextResponse.json({ headlines: [], breaking: [] });
    }
  }
}

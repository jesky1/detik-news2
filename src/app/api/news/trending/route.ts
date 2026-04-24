import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    // Check for cached trending topics in DB
    const cachedTopics = await db.trendingTopic.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - CACHE_DURATION_MS) },
      },
      orderBy: { count: 'desc' },
      take: 10,
    });

    if (cachedTopics.length > 0) {
      return NextResponse.json({ topics: cachedTopics });
    }

    // Fetch trending topics from web search
    const zai = await ZAI.create();
    const results = await zai.functions.invoke('web_search', {
      query: 'topik trending Indonesia hari ini',
      num: 10,
      recency_days: 1,
    });

    // Extract trending topics from search results
    // Use the search result titles/snippets as trending topics
    const topics = await Promise.all(
      results.slice(0, 10).map(async (result: {
        name: string;
        snippet: string;
        host_name: string;
      }, index: number) => {
        // Use the title as the trending topic name
        const topicName = result.name.length > 60
          ? result.name.slice(0, 60) + '...'
          : result.name;

        return db.trendingTopic.create({
          data: {
            topic: topicName,
            count: 10 - index, // Higher rank = higher count
          },
        });
      })
    );

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('[/api/news/trending] Error fetching trending topics:', error);

    // Fallback: return any cached results from DB regardless of age
    try {
      const fallbackTopics = await db.trendingTopic.findMany({
        orderBy: { count: 'desc' },
        take: 10,
      });
      return NextResponse.json({ topics: fallbackTopics });
    } catch {
      return NextResponse.json({ topics: [] });
    }
  }
}

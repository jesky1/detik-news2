import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

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

    const zai = await ZAI.create();
    const results = await zai.functions.invoke('web_search', {
      query: q,
      num: 10,
      recency_days: 7,
    });

    const articles = results.map((result: {
      url: string;
      name: string;
      snippet: string;
      host_name: string;
      date?: string;
    }) => {
      const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.name.slice(0, 20))}/800/400`;

      return {
        title: result.name,
        summary: result.snippet,
        sourceUrl: result.url,
        sourceName: result.host_name || 'detik.com',
        imageUrl,
        category: 'berita',
        publishedAt: result.date ? new Date(result.date).toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('[/api/news/search] Error searching news:', error);
    return NextResponse.json({ articles: [] });
  }
}

import { NextResponse } from 'next/server';
import { fetchDetikTrending } from '@/lib/detik-rss';

export async function GET() {
  try {
    // Fetch trending topics from detik.com RSS
    const topics = await fetchDetikTrending(10);

    return NextResponse.json({
      topics: topics.map((t, i) => ({
        id: `trending-${i}-${Date.now()}`,
        topic: t.topic,
        count: topics.length - i,
      })),
    });
  } catch (error) {
    console.error('[/api/news/trending] Error fetching trending:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil trending dari detik.com', topics: [] },
      { status: 500 }
    );
  }
}

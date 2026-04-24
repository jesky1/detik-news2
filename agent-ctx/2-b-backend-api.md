# Task 2-b: Backend API Routes

## Summary
Created 4 API routes for the detik.com-like Indonesian news portal backend.

## Files Created
- `/home/z/my-project/src/app/api/news/route.ts` - Main news endpoint with category support
- `/home/z/my-project/src/app/api/news/search/route.ts` - Search endpoint
- `/home/z/my-project/src/app/api/news/headlines/route.ts` - Headlines & breaking news
- `/home/z/my-project/src/app/api/news/trending/route.ts` - Trending topics

## API Endpoints

### GET /api/news
- Query params: `category` (default: "berita")
- Valid categories: berita, ekonomi, hiburan, olahraga, teknologi, internasional
- Caches in DB for 30 minutes
- Returns: `{ articles: NewsArticle[], category: string }`

### GET /api/news/search
- Query params: `q` (required)
- Searches web with the query
- Returns: `{ articles: Array<{title, summary, sourceUrl, sourceName, imageUrl, category, publishedAt}> }`

### GET /api/news/headlines
- No params
- Fetches headlines and breaking news separately
- Returns: `{ headlines: NewsArticle[], breaking: NewsArticle[] }`

### GET /api/news/trending
- No params
- Returns trending topics from DB or fetches from web
- Returns: `{ topics: TrendingTopic[] }`

## Key Implementation Details
- Uses `z-ai-web-dev-sdk` web_search function for all external data
- Category-to-query mapping uses Indonesian language search queries
- 30-minute cache TTL via Prisma DB createdAt check
- Fallback to stale DB data on web search errors
- Placeholder images via picsum.photos
- ESLint clean

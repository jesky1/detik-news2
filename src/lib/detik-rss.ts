// === Detik.com Web Scraper (RINGAN) ===
// TIDAK mengambil ringkasan artikel - hanya judul, gambar, dan URL dari halaman list
// Jauh lebih cepat dan tidak membuat laptop macet

export interface DetikArticle {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
}

const DETIK_CATEGORY_URLS: Record<string, string> = {
  berita: 'https://www.detik.com/terpopuler/news',
  ekonomi: 'https://www.detik.com/terpopuler/finance',
  hiburan: 'https://www.detik.com/terpopuler/hot',
  olahraga: 'https://www.detik.com/terpopuler/sport',
  teknologi: 'https://www.detik.com/terpopuler/inet',
  internasional: 'https://www.detik.com/terpopuler/dunia',
};

const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
};

// === SIMPLE IN-MEMORY CACHE (5 menit) ===
const cache = new Map<string, { data: unknown; time: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) {
    return entry.data as T;
  }
  if (entry) cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, time: Date.now() });
}

function getSourceName(url: string): string {
  if (url.includes('finance.detik.com')) return 'DetikFinance';
  if (url.includes('hot.detik.com')) return 'DetikHot';
  if (url.includes('inet.detik.com')) return 'DetikInet';
  if (url.includes('sport.detik.com')) return 'DetikSport';
  if (url.includes('news.detik.com')) return 'DetikNews';
  if (url.includes('dunia.detik.com')) return 'DetikWorld';
  return 'DetikNews';
}

function cleanTitle(title: string): string {
  return title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse detik.com HTML - HANYA judul, URL, dan gambar
 * TANPA mengambil ringkasan (ringan & cepat)
 */
function parseDetikHTML(html: string, category: string): DetikArticle[] {
  const articles: DetikArticle[] = [];
  const seen = new Set<string>();

  // Extract articles from onclick attributes
  const pattern = /href="(https?:\/\/[^"]+\.detik\.com\/[^"]+)"\s+class="media__link"\s+onclick='_pt\(this,\s*"[^"]*",\s*"([^"]+)",/g;
  let m;

  while ((m = pattern.exec(html)) !== null) {
    const url = m[1];
    const title = cleanTitle(m[2]);

    if (seen.has(url)) continue;
    if (url.includes('/kolom/kirim') || url.endsWith('/x/')) continue;
    if (title.length < 15 || title === 'menu kanal') continue;

    seen.add(url);
    articles.push({
      title,
      summary: title, // gunakan judul sebagai summary (ringan!)
      sourceUrl: url,
      sourceName: getSourceName(url),
      imageUrl: '',
      category,
      publishedAt: new Date().toISOString(),
    });
  }

  // Extract images - match by proximity to article
  const imgPattern = /src="(https:\/\/awsimages\.detik\.net\.id\/[^"]+\?\w=\d+[^"]*)"[^>]*\s+alt="([^"]+)"[^>]*\s+title="([^"]+)"/g;
  const imageMap: Record<string, string> = {};
  while ((m = imgPattern.exec(html)) !== null) {
    const imgUrl = m[1];
    const imgTitle = cleanTitle(m[3]);
    if (imgUrl && imgTitle.length > 15) {
      imageMap[imgTitle] = imgUrl;
    }
  }

  // Match images to articles by title
  for (const article of articles) {
    if (!article.imageUrl) {
      article.imageUrl = imageMap[article.title] || '';
    }
  }

  return articles;
}

/**
 * Scrape a detik.com page - 1 request saja, timeout 8 detik
 */
async function scrapeDetikPage(url: string, category: string): Promise<DetikArticle[]> {
  const cacheKey = `page:${url}`;
  const cached = getCached<DetikArticle[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(8000), // 8 detik timeout
    });

    if (!res.ok) return [];

    const html = await res.text();
    const articles = parseDetikHTML(html, category);
    setCache(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error(`[detik-scraper] Error scraping ${url}:`, error);
    return [];
  }
}

// === Public API ===

/**
 * Fetch articles dari detik.com - RINGAN, hanya 1 request
 */
export async function fetchDetikNews(category: string, limit: number = 12): Promise<DetikArticle[]> {
  const cacheKey = `news:${category}:${limit}`;
  const cached = getCached<DetikArticle[]>(cacheKey);
  if (cached) return cached;

  const url = DETIK_CATEGORY_URLS[category] || DETIK_CATEGORY_URLS.berita;
  let articles = await scrapeDetikPage(url, category);

  // Jika kurang dari 5, coba halaman utama
  if (articles.length < 5) {
    const mainUrls: Record<string, string> = {
      berita: 'https://news.detik.com/',
      ekonomi: 'https://finance.detik.com/',
      hiburan: 'https://hot.detik.com/',
      olahraga: 'https://sport.detik.com/',
      teknologi: 'https://inet.detik.com/',
      internasional: 'https://www.detik.com/dunia/',
    };
    const mainUrl = mainUrls[category];
    if (mainUrl) {
      const mainArticles = await scrapeDetikPage(mainUrl, category);
      const existingUrls = new Set(articles.map(a => a.sourceUrl));
      for (const a of mainArticles) {
        if (!existingUrls.has(a.sourceUrl)) articles.push(a);
      }
    }
  }

  const result = articles.slice(0, limit);
  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch headlines - RINGAN, hanya 1-2 request
 */
export async function fetchDetikHeadlines(limit: number = 8): Promise<{ headlines: DetikArticle[]; breaking: DetikArticle[] }> {
  const cacheKey = `headlines:${limit}`;
  const cached = getCached<{ headlines: DetikArticle[]; breaking: DetikArticle[] }>(cacheKey);
  if (cached) return cached;

  // Hanya 1 request ke detik.com
  const newsArticles = await scrapeDetikPage('https://www.detik.com/terpopuler/news', 'berita');

  // Deduplicate
  const seen = new Set<string>();
  const allArticles: DetikArticle[] = [];
  for (const a of newsArticles) {
    if (!seen.has(a.sourceUrl)) { seen.add(a.sourceUrl); allArticles.push(a); }
  }

  const result = {
    headlines: allArticles.slice(0, limit),
    breaking: allArticles.slice(limit, limit + 5),
  };
  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch trending topics - RINGAN, 1 request
 */
export async function fetchDetikTrending(limit: number = 10): Promise<{ topic: string; sourceUrl: string; count: number }[]> {
  const cacheKey = `trending:${limit}`;
  const cached = getCached<{ topic: string; sourceUrl: string; count: number }[]>(cacheKey);
  if (cached) return cached;

  const articles = await scrapeDetikPage('https://www.detik.com/terpopuler/news', 'berita');
  const result = articles.slice(0, limit).map((a, i) => ({
    topic: a.title,
    sourceUrl: a.sourceUrl,
    count: limit - i,
  }));
  setCache(cacheKey, result);
  return result;
}

/**
 * Search articles - RINGAN, 1 request
 */
export async function searchDetikNews(query: string, limit: number = 10): Promise<DetikArticle[]> {
  const cacheKey = `search:${query}:${limit}`;
  const cached = getCached<DetikArticle[]>(cacheKey);
  if (cached) return cached;

  const searchUrl = `https://www.detik.com/search/searchall?query=${encodeURIComponent(query)}&sortby=time&sorttime=0`;
  const articles = await scrapeDetikPage(searchUrl, 'berita');

  const result = articles.slice(0, limit);
  setCache(cacheKey, result);
  return result;
}

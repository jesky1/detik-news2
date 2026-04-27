// === Detik.com Web Scraper ===
// Scrape artikel berita langsung dari halaman detik.com

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
    .trim();
}

/**
 * Parse detik.com HTML to extract articles
 * Strategy: extract from onclick attributes (reliable source of title)
 */
function parseDetikHTML(html: string, category: string): DetikArticle[] {
  const articles: DetikArticle[] = [];
  const seen = new Set<string>();

  // Extract all (url, title) pairs from onclick='_pt(this, "type", "TITLE", "action")'
  // The href and title are in the same <a> tag with class="media__link"
  const pattern = /href="(https?:\/\/[^"]+\.detik\.com\/[^"]+)"\s+class="media__link"\s+onclick='_pt\(this,\s*"[^"]*",\s*"([^"]+)",/g;
  let m;

  while ((m = pattern.exec(html)) !== null) {
    const url = m[1];
    const title = cleanTitle(m[2]);

    // Skip non-article links
    if (seen.has(url)) continue;
    if (url.includes('/kolom/kirim') || url.endsWith('/x/')) continue;
    if (title.length < 15 || title === 'menu kanal') continue;

    seen.add(url);
    articles.push({
      title,
      summary: '',
      sourceUrl: url,
      sourceName: getSourceName(url),
      imageUrl: '',
      category,
      publishedAt: new Date().toISOString(),
    });
  }

  // Extract images: find all awsimages.detik.net.id URLs
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
 * Scrape a detik.com page for articles
 */
async function scrapeDetikPage(url: string, category: string): Promise<DetikArticle[]> {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error(`[detik-scraper] Failed to fetch ${url}: ${res.status}`);
      return [];
    }

    const html = await res.text();
    return parseDetikHTML(html, category);
  } catch (error) {
    console.error(`[detik-scraper] Error scraping ${url}:`, error);
    return [];
  }
}

/**
 * Fetch article summary from detik.com article page
 */
async function fetchArticleSummary(articleUrl: string): Promise<string> {
  try {
    const res = await fetch(articleUrl, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return '';

    const html = await res.text();

    // Find the detail__text content area
    const textSection = html.match(/class="detail__body"[^>]*>([\s\S]*?)class="detail__footer/);
    if (textSection) {
      const text = textSection[1]
        .replace(/<strong[^>]*>[^<]*<\/strong>/g, '')
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text.length > 30) return text.slice(0, 300);
    }

    // Fallback: find <p> tags with substantial content
    const pPattern = /<p[^>]*class="[^"]*"/g; // skip, too specific
    // Just get any <p> content
    const simpleP = />([^<]{40,})</g;
    const paragraphs: string[] = [];
    let pm;
    while ((pm = simpleP.exec(html)) !== null) {
      const text = pm[1].trim();
      if (text.length > 40 && !text.includes('function') && !text.includes('var ') && !text.includes('{')) {
        paragraphs.push(text);
        if (paragraphs.length >= 3) break;
      }
    }
    if (paragraphs.length > 0) {
      return paragraphs.join(' ').slice(0, 300);
    }

    return '';
  } catch {
    return '';
  }
}

// === Public API ===

/**
 * Fetch articles from detik.com for a specific category
 */
export async function fetchDetikNews(category: string, limit: number = 12): Promise<DetikArticle[]> {
  const url = DETIK_CATEGORY_URLS[category] || DETIK_CATEGORY_URLS.berita;
  let articles = await scrapeDetikPage(url, category);

  // If not enough, try main category page
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

  // Fetch summaries for top 5
  const top5 = articles.slice(0, 5);
  const summaries = await Promise.allSettled(top5.map(a => fetchArticleSummary(a.sourceUrl)));
  for (let i = 0; i < top5.length; i++) {
    if (summaries[i].status === 'fulfilled') top5[i].summary = summaries[i].value;
  }

  return articles.slice(0, limit);
}

/**
 * Fetch headline articles from detik.com
 */
export async function fetchDetikHeadlines(limit: number = 8): Promise<{ headlines: DetikArticle[]; breaking: DetikArticle[] }> {
  const [newsArticles, hotArticles] = await Promise.all([
    scrapeDetikPage('https://www.detik.com/terpopuler/news', 'berita'),
    scrapeDetikPage('https://www.detik.com/terpopuler/hot', 'hiburan'),
  ]);

  const seen = new Set<string>();
  const allArticles: DetikArticle[] = [];
  for (const a of [...newsArticles, ...hotArticles]) {
    if (!seen.has(a.sourceUrl)) { seen.add(a.sourceUrl); allArticles.push(a); }
  }

  // Fetch summaries for top 5
  const top5 = allArticles.slice(0, 5);
  const summaries = await Promise.allSettled(top5.map(a => fetchArticleSummary(a.sourceUrl)));
  for (let i = 0; i < top5.length; i++) {
    if (summaries[i].status === 'fulfilled') top5[i].summary = summaries[i].value;
  }

  return {
    headlines: allArticles.slice(0, limit),
    breaking: allArticles.slice(limit, limit + 5),
  };
}

/**
 * Fetch trending topics from detik.com
 */
export async function fetchDetikTrending(limit: number = 10): Promise<{ topic: string; sourceUrl: string; count: number }[]> {
  const articles = await scrapeDetikPage('https://www.detik.com/terpopuler/news', 'berita');
  return articles.slice(0, limit).map((a, i) => ({
    topic: a.title,
    sourceUrl: a.sourceUrl,
    count: limit - i,
  }));
}

/**
 * Search articles from detik.com
 */
export async function searchDetikNews(query: string, limit: number = 10): Promise<DetikArticle[]> {
  const searchUrl = `https://www.detik.com/search/searchall?query=${encodeURIComponent(query)}&sortby=time&sorttime=0`;
  const articles = await scrapeDetikPage(searchUrl, 'berita');

  const top3 = articles.slice(0, 3);
  const summaries = await Promise.allSettled(top3.map(a => fetchArticleSummary(a.sourceUrl)));
  for (let i = 0; i < top3.length; i++) {
    if (summaries[i].status === 'fulfilled') top3[i].summary = summaries[i].value;
  }

  return articles.slice(0, limit);
}

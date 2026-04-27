import axios from 'axios';
import * as cheerio from 'cheerio';

// Interface disesuaikan dengan schema.prisma kamu
export interface NewsData {
    title: string;
    summary: string;
    sourceUrl: string;
    imageUrl: string;
    category: string;
}

export async function scrapeDetik(): Promise<NewsData[]> {
    try {
        // 1. Ambil HTML dari halaman terpopuler Detik
        const { data } = await axios.get('https://www.detik.com/terpopuler', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const articles: NewsData[] = [];

        // 2. Loop melalui elemen berita
        $('.list-content__item').each((i, el) => {
            // Ambil maksimal 15 berita agar tidak terlalu berat
            if (i < 15) {
                const title = $(el).find('.media__title a').text().trim();
                const sourceUrl = $(el).find('.media__title a').attr('href') || '';
                const imageUrl = $(el).find('.media__image img').attr('src') || '';

                // Mengambil deskripsi untuk field 'summary'
                // Jika tidak ada deskripsi, kita pakai judul sebagai cadangan
                const summary = $(el).find('.media__desc').text().trim() || title;

                // Mengambil kategori (biasanya ada sebelum tanggal)
                const categoryRaw = $(el).find('.media__date').text().split('|')[0].trim();
                const category = categoryRaw || 'berita';

                // Hanya masukkan jika ada judul dan link (data minimal)
                if (title && sourceUrl) {
                    articles.push({
                        title,
                        summary,
                        sourceUrl,
                        imageUrl,
                        category
                    });
                }
            }
        });

        return articles;
    } catch (error) {
        console.error("Gagal melakukan scraping:", error);
        return [];
    }
}
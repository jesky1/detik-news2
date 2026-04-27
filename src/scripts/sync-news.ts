import { scrapeDetik } from '../lib/scraper.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses sinkronisasi...");
  const newsItems = await scrapeDetik();

  for (const item of newsItems) {
    const existingArticle = await prisma.newsArticle.findFirst({
      where: { sourceUrl: item.sourceUrl }
    });

    if (existingArticle) {
      await prisma.newsArticle.update({
        where: { id: existingArticle.id },
        data: {
          title: item.title,
          summary: item.summary,
          imageUrl: item.imageUrl,
          category: item.category
        }
      });
    } else {
      await prisma.newsArticle.create({
        data: {
          title: item.title,
          summary: item.summary,
          sourceUrl: item.sourceUrl,
          imageUrl: item.imageUrl,
          category: item.category,
          sourceName: "detik.com",
          content: "Konten berita otomatis.", // Sementara karena content bersifat optional (?)
        }
      });
    }
  }

  console.log(`Berhasil memperbarui ${newsItems.length} berita!`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
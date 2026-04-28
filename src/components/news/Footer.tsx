'use client';

import { Facebook, Twitter, Instagram, Youtube, MessageCircle, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNewsStore } from '@/lib/news-store';

const footerCategories = [
  {
    title: 'Berita',
    category: 'berita',
    links: ['Nasional', 'Politik', 'Hukum & Kriminal', 'Peristiwa', 'Daerah'],
  },
  {
    title: 'Ekonomi',
    category: 'ekonomi',
    links: ['Bisnis', 'Keuangan', 'Saham', 'Properti', 'Industri'],
  },
  {
    title: 'Hiburan',
    category: 'hiburan',
    links: ['Selebriti', 'Film', 'Musik', 'Gosip', 'Lifestyle'],
  },
  {
    title: 'Olahraga',
    category: 'olahraga',
    links: ['Sepak Bola', 'Badminton', 'MotoGP', 'F1', 'E-Sport'],
  },
  {
    title: 'Teknologi',
    category: 'teknologi',
    links: ['Internet', 'Gadget', 'Software', 'Cyber Security', 'AI'],
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/bang.nikko.96' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/jesky707' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/myrisca_real' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@putrichikal4912' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/6281234567890' },
  { icon: Send, label: 'Telegram', href: 'https://t.me/mytania1' },
];

export function Footer() {
  const { setActiveCategory, setSearchQuery, setSearchOpen } = useNewsStore();

  const handleCategoryClick = (category: string) => {
    // Reset search, set category, then scroll to grid
    setSearchQuery('');
    setSearchOpen(false);
    setActiveCategory(category);
    setTimeout(() => {
      const el = document.getElementById('news-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubcategoryClick = (subcategory: string, parentCategory: string) => {
    // Set category + search query, then scroll to grid
    setSearchOpen(false);
    setActiveCategory(parentCategory);
    setSearchQuery(subcategory);
    setTimeout(() => {
      const el = document.getElementById('news-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <footer className="bg-[#0c0c0c] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Section - Logo & Social */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-2">
              <span className="text-white">KONOHA</span>
              <span className="text-[#e00000]">NEWS</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Portal berita terkini dan terpercaya dari Indonesia. Menyajikan informasi
              terbaru dari berbagai kategori untuk pembaca Indonesia.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#e00000] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Category Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
          {footerCategories.map((category) => (
            <div key={category.title}>
              <button
                onClick={() => handleCategoryClick(category.category)}
                className="text-white font-semibold text-sm mb-3 hover:text-[#e00000] transition-colors cursor-pointer w-full text-left"
              >
                {category.title}
              </button>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleSubcategoryClick(link, category.category)}
                      className="text-gray-400 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 border-t border-gray-700 pt-6 mt-10">
          <p>
  &copy; {new Date().getFullYear()} Warga Konoha. 
  Portal Berita Indonesia Terpercaya
</p>
         <div className="flex flex-wrap items-center gap-4">
          <a href="/tentang.html" className="hover:text-white transition-colors">Tentang Kami</a>
          <a href="/redaksi.html" className="hover:text-white transition-colors">Redaksi</a>
          <a href="/karir.html" className="hover:text-white transition-colors">Karir</a>
          <a href="/kontak.html" className="hover:text-white transition-colors">Kontak</a>
          <a href="/privasi.html" className="hover:text-white transition-colors">Privasi</a>
         </div>
        </div>
      </div>
    </footer>
  );
}

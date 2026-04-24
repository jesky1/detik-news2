'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerCategories = [
  {
    title: 'Berita',
    links: ['Nasional', 'Politik', 'Hukum & Kriminal', 'Peristiwa', 'Daerah'],
  },
  {
    title: 'Ekonomi',
    links: ['Bisnis', 'Keuangan', 'Saham', 'Properti', 'Industri'],
  },
  {
    title: 'Hiburan',
    links: ['Selebriti', 'Film', 'Musik', 'Gosip', 'Lifestyle'],
  },
  {
    title: 'Olahraga',
    links: ['Sepak Bola', 'Badminton', 'MotoGP', 'F1', 'E-Sport'],
  },
  {
    title: 'Teknologi',
    links: ['Internet', 'Gadget', 'Software', 'Cyber Security', 'AI'],
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-[#0c0c0c] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Section - Logo & Social */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-2">
              <span className="text-white">DETIK</span>
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
              <h3 className="text-white font-semibold text-sm mb-3">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-xs transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2025 DetikNews. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Tentang Kami</a>
            <a href="#" className="hover:text-white transition-colors">Redaksi</a>
            <a href="#" className="hover:text-white transition-colors">Karir</a>
            <a href="#" className="hover:text-white transition-colors">Kontak</a>
            <a href="#" className="hover:text-white transition-colors">Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

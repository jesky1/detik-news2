'use client';

import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useNewsStore } from '@/lib/news-store';

const navLinks = [
  { label: 'Berita', category: 'berita' },
  { label: 'Ekonomi', category: 'ekonomi' },
  { label: 'Hiburan', category: 'hiburan' },
  { label: 'Olahraga', category: 'olahraga' },
  { label: 'Teknologi', category: 'teknologi' },
  { label: 'Internasional', category: 'internasional' },
];

function getIndonesianDate() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export function Header() {
  const { setActiveCategory, setSearchOpen } = useNewsStore();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Scroll to news grid section
    const newsSection = document.getElementById('news-grid-section');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-[#0c0c0c] sticky top-0 z-50 shadow-lg">
      {/* Top bar with date */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="text-gray-400 text-xs">{getIndonesianDate()}</span>
          <div className="flex items-center gap-3">
            <button
              className="text-gray-400 hover:text-white transition-colors md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-white">DETIK</span>
            <span className="text-[#e00000]">NEWS</span>
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.category}
              onClick={() => handleCategoryClick(link.category)}
              className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Cari berita...</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0c0c0c] border-white/10 w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <span className="text-white font-extrabold">DETIK</span>
                  <span className="text-[#e00000] font-extrabold">NEWS</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <button
                    key={link.category}
                    onClick={() => handleCategoryClick(link.category)}
                    className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-md text-base font-medium transition-colors border-b border-white/5 text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="mt-6 px-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-gray-300 hover:text-white rounded-md px-3 py-2.5 text-sm transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Cari berita...</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

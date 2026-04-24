import { create } from 'zustand';

interface NewsStore {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  activeCategory: 'all',
  setActiveCategory: (category) => set({ activeCategory: category }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));

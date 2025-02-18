import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchState } from '../types/movie';

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      selectedIndex: -1,
      favorites: [],
      setQuery: (query) => set({ query, selectedIndex: -1 }),
      setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
      toggleFavorite: (movie) => {
        const favorites = get().favorites;
        const isFavorited = favorites.some((f) => f.id === movie.id);
        
        set({
          favorites: isFavorited
            ? favorites.filter((f) => f.id !== movie.id)
            : [...favorites, movie],
        });
      },
      isFavorite: (movieId) => get().favorites.some((f) => f.id === movieId),
    }),
    {
      name: 'movie-search-storage',
      partialize: (state) => ({ favorites: state.favorites }), 
    }
  )
);
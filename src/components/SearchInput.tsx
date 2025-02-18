import React, { useCallback, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { SearchResults } from './SearchResults';

interface Props {
  onClose?: () => void;
}

export const SearchInput: React.FC<Props> = ({ onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, selectedIndex, setSelectedIndex, toggleFavorite } = useSearchStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<any>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }, [setQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(Math.max(-1, selectedIndex - 1));
    } else if (e.key === ' ' && selectedMovie) {
      e.preventDefault(); // Previne o espaço de ser digitado no input
      toggleFavorite(selectedMovie);
    }
  }, [selectedIndex, setSelectedIndex, selectedMovie, toggleFavorite]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={inputRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Pesquise um filme"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          autoComplete="off"
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Utilize as teclas ↑ ↓ para navegar entre as opções
      </p>
      {isOpen && <SearchResults onClose={() => setIsOpen(false)} onMovieSelect={setSelectedMovie} />}
    </div>
  );
};
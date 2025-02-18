import React, { useCallback, useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { SearchResults } from './SearchResults';
import { Movie } from '../types/movie';
import { searchMovies } from '../lib/tmdb';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  onClose?: () => void;
}

export const SearchInput: React.FC<Props> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, selectedIndex, setSelectedIndex, toggleFavorite } = useSearchStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [previousQuery, setPreviousQuery] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');
  const debouncedQuery = useDebounce(query, 150);

  // Buscar sugestões quando o query mudar
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length > 0) {
        try {
          const results = await searchMovies(debouncedQuery, 1);
          
          if (results.results.length > 0) {
            const firstMovie = results.results[0];
            const normalizedQuery = debouncedQuery.toLowerCase().trim();
            const title = firstMovie.title;
            const lowerTitle = title.toLowerCase();
            
          if (lowerTitle.startsWith(normalizedQuery)) {
              const remainingText = title.slice(debouncedQuery.length);
              
              // Se o texto restante começa com espaço, é uma nova palavra
              // Se não, estamos no meio de uma palavra
              const suggestion = remainingText.startsWith(' ') ? remainingText : remainingText.trimLeft();
              
              if (suggestion.length > 0) {
                setSuggestion(suggestion);
                return;
              }
            }
          }
        } catch (error) {
          console.error('Erro ao buscar sugestões:', error);
        }
      }
      setSuggestion('');
    };

    fetchSuggestions();
  }, [debouncedQuery]);

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
      e.preventDefault();
      toggleFavorite(selectedMovie);
    } else if (e.key === 'ArrowRight' && suggestion) {
      e.preventDefault();
      setPreviousQuery(query);
      setQuery(query + suggestion);
      setSuggestion('');
    } else if (e.key === 'ArrowLeft' && previousQuery) {
      e.preventDefault();
      setQuery(previousQuery);
      setPreviousQuery('');
    }
  }, [selectedIndex, setSelectedIndex, selectedMovie, toggleFavorite, query, suggestion, previousQuery, setQuery]);

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
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder="Pesquise um filme"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base leading-normal"
            autoComplete="off"
          />
          {suggestion && (
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
              <div className="flex items-center h-full px-4">
                <span className="invisible whitespace-pre text-base leading-normal">{query}</span>
                <span className="text-gray-400 text-base leading-normal">{suggestion}</span>
              </div>
            </div>
          )}
        </div>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      <p className="text-sm text-gray-500 mt-2 mb-1">
        Utilize as teclas ↑ ↓ para navegar entre as opções{suggestion && ' • → para completar'}
        {previousQuery && ' • ← para voltar'}
      </p>
      <div className="relative">
        {isOpen && <SearchResults onClose={() => setIsOpen(false)} onMovieSelect={setSelectedMovie} />}
      </div>
    </div>
  );
};
import React, { useRef, useEffect, useMemo } from 'react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSearchStore } from '../store/searchStore';
import { searchMovies, getMovieDetails } from '../lib/tmdb';
import { MovieCard } from './MovieCard';
import { useInView } from 'react-intersection-observer';
import { Movie } from '../types/movie';
import { highlightText, cn } from '../lib/utils';

interface Props {
  onClose?: () => void;
  onMovieSelect?: (movie: Movie | null) => void;
}

interface SearchResults {
  results: Movie[];
  total_pages: number;
}

export const SearchResults: React.FC<Props> = ({ onClose, onMovieSelect }) => {
  const { query, selectedIndex } = useSearchStore();
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<SearchResults, Error, InfiniteData<SearchResults>, ['movies', string], number>({
    queryKey: ['movies', query],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!query) return { results: [], total_pages: 0 };
      
      const searchResults = await searchMovies(query, pageParam);
      const moviesWithDetails = await Promise.all(
        searchResults.results.map((movie: Movie) => getMovieDetails(movie.id))
      );
      
      return {
        ...searchResults,
        results: moviesWithDetails,
      };
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.total_pages) {
        return pages.length + 1;
      }
      return undefined;
    },
    enabled: query.length > 0,
  });

  // Separar o primeiro filme e os demais
  const { firstMovie, otherMovies } = useMemo(() => {
    const allMovies = data?.pages.flatMap((page: SearchResults) => page.results) ?? [];
    const first = allMovies.length > 0 ? allMovies[0] : null;
    const others = allMovies.length > 0 ? allMovies.slice(1) : [];

    return { firstMovie: first, otherMovies: others };
  }, [data]);

  // Efeito para scroll automático quando o item selecionado muda
  useEffect(() => {
    if (selectedIndex >= 0 && containerRef.current && itemRefs.current[selectedIndex]) {
      const container = containerRef.current;
      const selectedItem = itemRefs.current[selectedIndex];
      
      if (selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        // Definir uma margem para começar o scroll antes de chegar totalmente na borda
        const margin = 50;
        
        if (itemRect.bottom + margin > containerRect.bottom) {
          // Item está próximo ou abaixo da borda inferior
          container.scrollBy({
            top: itemRect.bottom - containerRect.bottom + margin,
            behavior: 'smooth'
          });
        } else if (itemRect.top - margin < containerRect.top) {
          // Item está próximo ou acima da borda superior
          container.scrollBy({
            top: itemRect.top - containerRect.top - margin,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedIndex]);

  // Efeito para atualizar o filme selecionado
  useEffect(() => {
    if (!firstMovie && !otherMovies.length) {
      onMovieSelect?.(null);
      return;
    }

    // Encontrar o filme selecionado na lista ordenada
    const selectedMovie = selectedIndex >= 0 ? (firstMovie ? (selectedIndex === 0 ? firstMovie : otherMovies[selectedIndex - 1]) : otherMovies[selectedIndex]) : null;
    onMovieSelect?.(selectedMovie);
  }, [selectedIndex, firstMovie, otherMovies, onMovieSelect]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (!query) return null;

  if (!firstMovie && !otherMovies.length && !isFetching) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 mb-4">Nenhum resultado encontrado para "{query}"</p>
        <div className="space-x-4">
          <a
            href={`https://www.imdb.com/find?q=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={onClose}
          >
            Buscar no IMDB
          </a>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(query)} movie`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={onClose}
          >
            Buscar no Google
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto custom-scrollbar">
      {firstMovie && (
        <div 
          ref={el => itemRefs.current[0] = el}
          className={cn("transition-colors cursor-pointer", {
            'bg-blue-50': selectedIndex === 0,
            'hover:bg-gray-50': selectedIndex !== 0
          })}
        >
          <div className="p-4">
            <MovieCard
              movie={firstMovie}
              isSelected={selectedIndex === 0}
              onSelect={onClose}
              highlightedTitle={highlightText(firstMovie.title, query)}
            />
          </div>
        </div>
      )}
      <div className="py-2">
        {otherMovies.map((movie, index) => {
          const actualIndex = firstMovie ? index + 1 : index;
          return (
            <div 
              key={movie.id}
              ref={el => itemRefs.current[actualIndex] = el}
              className={cn("transition-colors cursor-pointer", {
                'bg-blue-50': actualIndex === selectedIndex,
                'hover:bg-gray-50': actualIndex !== selectedIndex
              })}
            >
              <div className="px-4 py-2">
                <MovieCard
                  movie={movie}
                  isSelected={actualIndex === selectedIndex}
                  isCompact
                  onSelect={onClose}
                  highlightedTitle={highlightText(movie.title, query)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div ref={ref} className="h-4" />
      {isFetching && (
        <div className="p-4 text-center text-gray-600 border-t border-gray-100">
          Carregando mais resultados...
        </div>
      )}
    </div>
  );
};
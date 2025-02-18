import React from 'react';
import { Star } from 'lucide-react'
import { cn } from '../lib/utils';
import { useSearchStore } from '../store/searchStore';
import { Movie } from '../types/movie';

interface Props {
  movie: Movie;
  isCompact?: boolean;
  isSelected?: boolean;
  highlightedTitle?: string;
  onSelect?: () => void;
}

export function MovieCard({
  movie,
  isCompact,
  isSelected,
  highlightedTitle,
  onSelect
}: Props) {
  const { toggleFavorite, isFavorite } = useSearchStore();
  const favorited = isFavorite(movie.id);
  const year = new Date(movie.release_date).getFullYear();

  if (isCompact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer",
          isSelected && "bg-blue-50 hover:bg-blue-50"
        )}
        onClick={onSelect}
      >
        <img
          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
          alt={movie.title}
          className="w-8 h-12 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            <span dangerouslySetInnerHTML={{ __html: highlightedTitle || movie.title }} />
          </h3>
          <p className="text-sm text-gray-500">
            {year}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-start gap-4 rounded-lg transition-colors px-2",
        isSelected && "bg-blue-50"
      )}
    >
      <img
        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
        alt={movie.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            <span dangerouslySetInnerHTML={{ __html: highlightedTitle || movie.title }} />
            <span className="text-gray-500 ml-2">({year})</span>
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Star
              className={cn(
                "h-5 w-5",
                favorited ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )}
            />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <a
          href={`https://www.imdb.com/title/${movie.imdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
          onClick={onSelect}
        >
          Ver no IMDB
        </a>
      </div>
    </div>
  );
}
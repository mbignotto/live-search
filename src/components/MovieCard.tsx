import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { useSearchStore } from '../store/searchStore';
import { cn } from '../lib/utils';

interface Props {
  movie: Movie;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isCompact?: boolean;
  onSelect?: () => void;
  highlightedTitle?: string;
}

export const MovieCard: React.FC<Props> = ({ 
  movie, 
  isSelected,
  isCompact,
  onSelect,
  highlightedTitle
}) => {
  const { toggleFavorite, isFavorite } = useSearchStore();
  const favorited = isFavorite(movie.id);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  if (isCompact) {
    return (
      <div 
        className={cn(
          "flex items-center justify-between py-2 rounded transition-colors",
          isSelected && "bg-blue-50"
        )}
      >
        <a
          href={`https://www.imdb.com/title/${movie.imdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 hover:underline"
          onClick={onSelect}
        >
          <span 
            className="font-medium"
            dangerouslySetInnerHTML={{ __html: highlightedTitle || movie.title }}
          />
          {year && <span className="text-gray-500 ml-2">({year})</span>}
        </a>
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
            {year && <span className="text-gray-500 ml-2">({year})</span>}
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
        <div className="flex gap-2 mt-2 flex-wrap">
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
};
import React from 'react';
import { useSearchStore } from '../store/searchStore';
import { MovieCard } from './MovieCard';

export const FavoritesList: React.FC = () => {
  const { favorites } = useSearchStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <h2 className="text-xl font-semibold mb-4">Filmes Favoritos</h2>
        <p>Nenhum filme favorito ainda. Use a busca acima para encontrar e favoritar filmes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Filmes Favoritos</h2>
      <div className="space-y-4">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isHighlighted />
        ))}
      </div>
    </div>
  );
};
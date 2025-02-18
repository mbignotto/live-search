export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  genres: Genre[];
  imdb_id: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchState {
  query: string;
  selectedIndex: number;
  favorites: Movie[];
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
}
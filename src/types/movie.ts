export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  imdb_id: string
  genres: Genre[]
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

export interface SearchResults {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}
import axios from 'axios';
import { Movie } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error('API key não encontrada. Crie um arquivo .env com VITE_TMDB_API_KEY');
}

const BASE_URL = 'https://api.themoviedb.org/3';

export interface SearchResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const searchMovies = async (query: string, page: number = 1): Promise<SearchResults> => {
  try {
    const response = await api.get<SearchResults>('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'external_ids',
    },
  });
  
  return response.data;
};
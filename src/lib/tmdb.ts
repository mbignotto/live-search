import axios from 'axios';

const TMDB_API_KEY = '863d64bb387d3b81c7f36211b8cd126b';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
    },
  });
  
  return response.data;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'external_ids',
    },
  });
  
  return response.data;
};
// src/services/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const LANG = import.meta.env.VITE_TMDB_LANGUAGE || 'pt-BR';

async function fetchFromTMDB(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  // params básicos
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANG);
  // adicionar params extras
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB error: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function getGenres() {
  const data = await fetchFromTMDB('/genre/movie/list');
  return data.genres; // array de {id, name}
}

export async function searchMoviesByTitle(query, page = 1) {
  const data = await fetchFromTMDB('/search/movie', { query, page });
  return data.results;
}

export async function discoverMoviesByGenre(genreId, page = 1) {
  const data = await fetchFromTMDB('/discover/movie', { with_genres: genreId, page });
  return data.results;
}

export async function searchMoviesByTitleAndGenre(query, genreId, page = 1) {
  // estratégia: usar /search e filtrar localmente pelos gêneros
  const results = await searchMoviesByTitle(query, page);
  if (!genreId) return results;
  return results.filter(movie => (movie.genre_ids || []).includes(Number(genreId)));
}

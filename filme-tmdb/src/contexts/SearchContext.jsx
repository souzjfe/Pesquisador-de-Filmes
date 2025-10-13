import React, { createContext, useReducer, useEffect } from 'react';

export const SearchContext = createContext();

const initialState = {
  title: '',
  genreId: '',
  genres: [],
  movies: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_GENRE':
      return { ...state, genreId: action.payload };
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, movies: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_MOVIES':
      return { ...state, movies: [] };
    default:
      return state;
  }
}

export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // buscar lista de gêneros ao carregar app
  useEffect(() => {
    const key = import.meta.env.VITE_TMDB_API_KEY;
    const base = import.meta.env.VITE_TMDB_BASE_URL;
    const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'pt-BR';
    if (!key) {
      dispatch({ type: 'FETCH_ERROR', payload: 'API Key do TMDB não configurada.' });
      return;
    }
    fetch(`${base}/genre/movie/list?api_key=${key}&language=${lang}`)
      .then(res => res.json())
      .then(data => {
        if (data.genres) dispatch({ type: 'SET_GENRES', payload: data.genres });
        else dispatch({ type: 'FETCH_ERROR', payload: 'Erro ao carregar gêneros' });
      })
      .catch(err => dispatch({ type: 'FETCH_ERROR', payload: 'Erro ao carregar gêneros' }));
  }, []);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}

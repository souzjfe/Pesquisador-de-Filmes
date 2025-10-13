import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import { SearchContext } from './contexts/SearchContext';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function App() {
  const { state } = useContext(SearchContext);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Busca de Filmes (TMDB) — useReducer + Material UI
      </Typography>

      <SearchForm />

      <Box sx={{ mt: 3 }}>
        {state.loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {state.error && <Alert severity="error">{state.error}</Alert>}

        {!state.loading && !state.error && <MovieList movies={state.movies} />}
      </Box>
    </Container>
  );
}

import React, { useContext, useState } from 'react';
import { SearchContext } from '../contexts/SearchContext';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function SearchForm() {
  const { state, dispatch } = useContext(SearchContext);
  const [localTitle, setLocalTitle] = useState(state.title);
  const [localGenre, setLocalGenre] = useState(state.genreId);

  // validação: exige pelo menos um campo (título ou gênero)
  const validate = () => {
    if (!localTitle.trim() && !localGenre) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Preencha o título ou selecione um gênero.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FETCH_ERROR', payload: null });

    if (!validate()) return;

    dispatch({ type: 'FETCH_START' });

    const key = import.meta.env.VITE_TMDB_API_KEY;
    const base = import.meta.env.VITE_TMDB_BASE_URL;
    const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'pt-BR';

    try {
      // Se tiver título e gênero: podemos preferir usar discover com filtro por query manual (discover não tem query),
      // então fazemos search por título e filtramos por gênero localmente.
      let results = [];

      if (localTitle.trim()) {
        const q = encodeURIComponent(localTitle.trim());
        const res = await fetch(`${base}/search/movie?api_key=${key}&language=${lang}&query=${q}`);
        const data = await res.json();
        results = data.results || [];
      } else {
        // sem título: buscar por gênero com discover
        const res = await fetch(`${base}/discover/movie?api_key=${key}&language=${lang}&with_genres=${localGenre}`);
        const data = await res.json();
        results = data.results || [];
      }

      // se tiver ambos, filtra por gênero após search
      if (localTitle.trim() && localGenre) {
        results = results.filter(movie => (movie.genre_ids || []).includes(Number(localGenre)));
      }

      if (!results || results.length === 0) {
        dispatch({ type: 'FETCH_SUCCESS', payload: [] });
        dispatch({ type: 'FETCH_ERROR', payload: 'Nenhum filme encontrado.' });
        return;
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: results });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Erro ao buscar filmes. Tente novamente.' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Título do filme"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            helperText="Pode buscar por título (opcional se escolher gênero)"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="genre-label">Gênero</InputLabel>
            <Select
              labelId="genre-label"
              label="Gênero"
              value={localGenre}
              onChange={(e) => setLocalGenre(e.target.value)}
            >
              <MenuItem value="">— Nenhum —</MenuItem>
              {state.genres.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type="submit" variant="contained" fullWidth>
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

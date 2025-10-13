import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <Typography>Nenhum filme para exibir.</Typography>;
  }

  const baseImg = 'https://image.tmdb.org/t/p/w342';

  return (
    <Grid container spacing={2}>
      {movies.map(movie => (
        <Grid key={movie.id} item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            {movie.poster_path ? (
              <CardMedia component="img" height="350" image={baseImg + movie.poster_path} alt={movie.title} />
            ) : (
              <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eee' }}>
                <Typography>Sem imagem</Typography>
              </Box>
            )}

            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.release_date} — Nota: {movie.vote_average}
              </Typography>
              <Typography mt={1} variant="body2">{movie.overview?.slice(0, 140)}{movie.overview?.length > 140 ? '...' : ''}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

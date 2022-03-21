import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Pokeapi from '../images/pokeapi.png';
import Pokeball from '../images/pokeball.png';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { Search as SearchIcon } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    height: '100%',
  },
  media: {
    height: 250,
  },
});

export const Dashboard = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState('');
  const [pokemon, setPokemon] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [pokemonFound, setPokemonFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20'
        );

        const {
          data: { results },
        } = response;

        results.map(async (result) => {
          try {
            let res = await axios.get(result.url);
            setPokemonList((prevArray) => [...prevArray, res]);
          } catch (error) {
            console.log('Error->res', error);
          }
        });
      } catch (error) {
        console.log('Error->response', error);
      }
    })();
  }, []);

  const onSearch = async () => {
    if (searchPokemon === '') {
      setIsSearching(false);
      setIsLoading(false);
      setPokemonFound(false);
      setPokemonList([]);
      (async () => {
        try {
          const response = await axios.get(
            'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20'
          );

          const {
            data: { results },
          } = response;

          results.map(async (result) => {
            try {
              let res = await axios.get(result.url);
              setPokemonList((prevArray) => [...prevArray, res]);
            } catch (error) {
              console.log('Error->res', error);
            }
          });
        } catch (error) {
          console.log('Error->response', error);
        }
      })();
    } else {
      try {
        let response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchPokemon.toLocaleLowerCase()}`
        );
        console.log('onSearch->Response', response);
        setIsSearching(true);
        setIsLoading(true);
        setPokemon(response.data);
        setPokemonFound(true);
        setPokemonList([]);
      } catch (error) {
        setIsSearching(true);
        setIsLoading(true);
        setPokemonFound(false);
        setPokemonList([]);
        console.log('Error-> onSearch', error);
      }
    }
  };

  useEffect(() => {
    if (isLoading && isSearching) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [isLoading, isSearching]);

  const classes = useStyles();

  console.log('PokemonList', pokemonList);
  console.log('Pokemonfound', pokemonFound);
  console.log('isSearching', isSearching);

  return (
    <div style={{ backgroundColor: '#e0e0e0' }}>
      <CssBaseline />
      <Container maxWidth='lg'>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          marginTop={5}
          marginBottom={5}
        >
          <img src={Pokeapi} alt='pokeapi' />
          <Grid item xs={12} sm={12} marginTop={5}>
            <Paper
              elevation={2}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '2px 4px',
              }}
            >
              <InputBase
                value={searchPokemon}
                placeholder='Find Pokemón'
                onChange={(e) => setSearchPokemon(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
                style={{
                  width: '97%',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
              />
              <IconButton onClick={onSearch}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>

          <Grid
            container
            justifyContent='center'
            alignItems='center'
            marginTop={5}
          >
            {isSearching ? (
              isLoading ? (
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  direction='row'
                >
                  <Typography
                    gutterBottom
                    variant='h2'
                    component='h1'
                    marginTop={2}
                  >
                    Searching....{' '}
                    <img
                      src={Pokeball}
                      alt='pokeball'
                      width='50px'
                      className='rotating'
                    />
                  </Typography>
                </Grid>
              ) : !pokemonFound ? (
                <Grid item>
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardContent>
                        <CardMedia
                          image={`../images/pokeball.png`}
                          className='rotating'
                        />
                        <img
                          src={Pokeball}
                          alt='pokeball'
                          width='200px'
                          className='pokeball'
                        />
                        <Typography
                          gutterBottom
                          variant='h5'
                          component='h2'
                          align='center'
                          marginTop={3}
                        >
                          Pokemón not found
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{ textAlign: 'center' }}
                  alignSelf='center'
                >
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardContent>
                        <CardMedia
                          image={pokemon?.sprites?.front_default}
                          className={classes.media}
                        />
                        <Typography gutterBottom variant='h5' component='h2'>
                          {pokemon.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            ) : (
              pokemonList.map(({ data }, index) => (
                <Grid item xs={12} sm={4} marginBottom={5}>
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardContent>
                        <CardMedia
                          image={data.sprites.front_default}
                          className={classes.media}
                        />
                        <Typography gutterBottom variant='h5' component='h2'>
                          {data.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

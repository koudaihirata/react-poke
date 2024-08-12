import logo from './logo.svg';
import './App.css';
import PokemonThumbnails from './PokemonThumbnails';
import { useEffect } from 'react';

function App() {
  const pokemon = [
    {
      id: 1,
      name: "フシギダネ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      type: "くさ"
    },
    {
      id: 2,
      name: "フシギソウ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      type: "くさ"
    },
    {
      id: 3,
      name: "フシギバナ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
      type: "くさ"
    },
  ]

  const url = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  },[])

  return (
    <div className="App">
      <PokemonThumbnails id={pokemon[0].id} name={pokemon[0].name} image={pokemon[0].image} type={pokemon[0].type} />
      <PokemonThumbnails id={pokemon[1].id} name={pokemon[1].name} image={pokemon[1].image} type={pokemon[1].type} />
      <PokemonThumbnails id={pokemon[2].id} name={pokemon[2].name} image={pokemon[2].image} type={pokemon[2].type} />
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import PokemonThumbnails from './PokemonThumbnails';
import { useEffect } from 'react';

function App() {
  const pokemons = [
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
      {pokemons.map((pokemon, index) => (
        <PokemonThumbnails 
          id={pokemon.id} 
          name={pokemon.name} 
          image={pokemon.image} 
          type={pokemon.type} 
          key={pokemon.id} 
        />
      ))}
    </div>
  );
}

export default App;

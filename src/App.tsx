import logo from './logo.svg';
import './App.css';
import PokemonThumbnails from './PokemonThumbnails';
import { useEffect, useState } from 'react';

type Pokemon = {
  id: number;
  name: string;
  image: string;
  type: string;
};

function App() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");

  useEffect(() => {
    const getAllPokemons = () => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setUrl(data.next);

          // 各ポケモンの詳細データを取得して更新
          const results = data.results;
          for (const pokemon of results) {
            const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
            fetch(pokemonUrl)
              .then(res => res.json())
              .then(data => {
                const _image = data.sprites.other["official-artwork"].front_default;
                const _type = data.types[0].type.name;
                const newList: Pokemon = {
                  id: data.id,
                  name: data.name,
                  image: _image,
                  type: _type
                };
                // 既存のデータを展開し、新しいデータを追加する
                setAllPokemons(currentList => [...currentList, newList]);
              });
          }
        });
    };

    getAllPokemons();
  }, [url]);

  return (
    <div className="App">
      {allPokemons.map((pokemon) => (
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

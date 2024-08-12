import { useEffect, useState } from 'react';
import PokemonThumbnails from './PokemonThumbnails';
import pokemonJson from "./pokemon.json";
import pokemonTypeJson from "./pokemonType.json";

type PokemonType = "grass" | "fire" | "water" | "bug" | "normal" | "poison" | "electric" | "ground" | "fairy" | "fighting" | "psychic" | "rock" | "ice" | "dragon" | "ghost" | "steel" | "dark";

type Pokemon = {
  id: number;
  name: string;
  iconImage: string;
  image: string;
  type: string;
  jpName: string;
  jpType: string;
};

type ApiPokemonResult = {
  name: string;
  url: string;
};

type ApiPokemonData = {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

type PokemonJson = {
  en: string;
  ja: string;
};

type PokemonTypeJson = {
  [key: string]: string;
};

function App() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [url, setUrl] = useState<string>("https://pokeapi.co/api/v2/pokemon?limit=20");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAllPokemons = () => {
      setIsLoading(true);
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setUrl(data.next);
          createPokemonObject(data.results);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getAllPokemons();
  }, [url]);

  const createPokemonObject = async (results: ApiPokemonResult[]) => {
    for (const pokemon of results) {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      try {
        const res = await fetch(pokemonUrl);
  
        // リクエストが成功したかどうかを確認
        if (!res.ok) {
          throw new Error(`Failed to fetch data for ${pokemon.name}`);
        }
  
        const data: ApiPokemonData = await res.json();
        
        const _image = data.sprites.other["official-artwork"].front_default;
        const _iconImage = data.sprites.other.dream_world.front_default;
        const _type = data.types[0].type.name as PokemonType;
        const japanese = await translateToJapanese(data.name, _type);
        
        const newList: Pokemon = {
          id: data.id,
          name: data.name,
          iconImage: _iconImage,
          image: _image,
          type: _type,
          jpName: japanese.name,
          jpType: japanese.type
        };
        setAllPokemons(currentList => [...currentList, newList]);
  
      } catch (error) {
        console.error(`Error fetching data for ${pokemon.name}:`, error);
      }
    }
  };
  
  const translateToJapanese = async (name: string, type: PokemonType): Promise<{ name: string; type: string }> => {
    const jpName = pokemonJson.find(
      (pokemon: PokemonJson) => pokemon.en.toLowerCase() === name
    )?.ja || name;  // nameが見つからない場合はそのまま
    const jpType = pokemonTypeJson[type] || type;  // typeが見つからない場合はそのまま
    return { name: jpName, type: jpType };
  };

  return (
    <div className="app-container">
      <h1>ポケモン図鑑</h1>
      <div className='pokemon-container'>
        <div className='all-container'>
          {allPokemons.sort((a, b) => a.id - b.id).map((pokemon, index) => (
            <PokemonThumbnails
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              iconImage={pokemon.iconImage}
              type={pokemon.type}
              key={`${pokemon.id}-${index}`}
              jpName={pokemon.jpName}
              jpType={pokemon.jpType}
            />
          ))}
        </div>
        {isLoading ? (
          <div className='load-more'>now loading...</div>
        ) : (
          <button className='load-more' onClick={() => setUrl("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20")} type="button">
            もっとみる！
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

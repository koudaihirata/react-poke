import { useCallback, useEffect, useRef, useState } from 'react';
import PokemonThumbnails from './PokemonThumbnails';
import pokemonJson from "./pokemon.json";
import pokemonTypeJson from "./pokemonType.json";

type PokemonType = keyof typeof pokemonTypeJson;

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
  [key in PokemonType]: string;
};

function App() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [url, setUrl] = useState<string>("https://pokeapi.co/api/v2/pokemon?limit=20");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isInitialRender = useRef(true);

  const getAllPokemons = useCallback(() => {
    setIsLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setUrl(data.next); // 次の20件のURLをセットする
        console.log(data.next);
        createPokemonObject(data.results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);   

  const createPokemonObject = async (results: ApiPokemonResult[]) => {
    const newPokemons: Pokemon[] = [];

    for (const pokemon of results) {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      try {
        const res = await fetch(pokemonUrl);

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

        newPokemons.push(newList);

      } catch (error) {
        console.error(`Error fetching data for ${pokemon.name}:`, error);
      }
    }

    setAllPokemons(currentList => [...currentList, ...newPokemons]);
  };

  const translateToJapanese = async (
    name: string,
    type: PokemonType
  ): Promise<{ name: string; type: string }> => {
    // ポケモン名を小文字に統一して検索
    const jpName = pokemonJson.find(
      (pokemon: PokemonJson) => pokemon.en.toLowerCase() === name.toLowerCase()
    )?.ja || name;
  
    // タイプの翻訳
    const jpType = pokemonTypeJson[type] || type;
  
    return { name: jpName, type: jpType };
  };

  useEffect(() => {
    if (isInitialRender.current) {
      getAllPokemons();
      isInitialRender.current = false;  // 初回実行済みを記録
    }
  }, [getAllPokemons]);

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
          <button className='load-more' onClick={getAllPokemons} type="button">
            もっとみる！
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

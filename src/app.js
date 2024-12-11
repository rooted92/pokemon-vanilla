const pokemonGallery = document.getElementById('#pokemon-gallery');

const buildPokemonElements = async () => {
    const pokemonData = getPokemon();
    console.log(pokemonData);
}

// on page load
buildPokemonElements();

async function getPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1302');
    const data = await response.json();
    console.log(data);
}
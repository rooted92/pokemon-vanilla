const pokemonGallery = document.getElementById('pokemon-gallery');


{/* <div class="pokemon-card">
    <div class="pokemon-image">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
            alt="Pokemon Image">
    </div>
    <div class="pokemon-info">
        <h2 class="text-xl font-bold">Bulbasaur</h2>
        <p class="text-sm">Grass | Poison</p>
    </div>
</div> */}

const buildPokemonElements = async (pokemonRequest) => {
    const data = await pokemonRequest();
    const pokemon = data.results;
    console.log(pokemon);
    pokemon.map(async (pokemon, index) => {
        const pokemonDetails = await getPokemonDetails(pokemon.url);
        console.log(pokemonDetails);
        let typeName = pokemonDetails.types[0].type.name;
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-4';
        pokemonCard.innerHTML = `
            <p key=${index}>${pokemon.name}</p>
            <p>${typeName}</p>
        `;
        pokemonGallery.appendChild(pokemonCard);
    });
}

// on page load
buildPokemonElements(getPokemon);

async function getPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20');
    const data = await response.json();
    return data;
}

async function getPokemonDetails(pokemonURL) {
    const response = await fetch(pokemonURL);
    const pokemonDetails = await response.json();
    return pokemonDetails;
}
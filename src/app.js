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
    pokemon.map(async (pokemon) => {
        const {name, type, image, id} = await getPokemonDetails(pokemon.url);
        
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-gray-300 rounded-lg shadow-lg';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='/' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" />
            </a>
            <p key=${id} class='text-lg font-semibold'>${name}</p>
            <p>${type}</p>
        `;
        pokemonGallery.appendChild(pokemonCard);
    });
}

// on page load
buildPokemonElements(getPokemon);

async function getPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=30&offset=0');
    const data = await response.json();
    return data;
}

async function getPokemonDetails(pokemonURL) {
    const response = await fetch(pokemonURL);
    const pokemonDetails = await response.json();
    console.log(pokemonDetails);
    let pokemonObject = {
        name: pokemonDetails.name,
        type: pokemonDetails.types[0].type.name,
        image: pokemonDetails.sprites.other['official-artwork'].front_default,
        id: pokemonDetails.id
    }
    return pokemonObject;
}
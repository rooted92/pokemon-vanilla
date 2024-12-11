const pokemonGallery = document.getElementById('pokemon-gallery');
const pokemonDetailsContainer = document.getElementById('pokemon-details');


const buildPokemonElements = async (getAllPokemonData) => {
    const allPokemon = await getAllPokemonData();

    allPokemon.forEach(async (pokemon) => {
        const { name, type, image, id } = await getPokemonDetails(pokemon.url);

        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-gray-300 rounded-lg shadow-lg';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='/src/pages/pokemon-details.html?id=${id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" />
            </a>
            <p key=${id} class='text-lg font-semibold'>${name}</p>
            <p>${type}</p>
        `;

        pokemonGallery.appendChild(pokemonCard);
    });
}

async function getAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=30&offset=0');
    const data = await response.json();
    return data.results;
}

async function getPokemonDetails(pokemonURL) {
    const response = await fetch(pokemonURL);
    const pokemonDetails = await response.json();

    let pokemonObject = {
        name: pokemonDetails.name,
        type: pokemonDetails.types[0].type.name,
        image: pokemonDetails.sprites.other['official-artwork'].front_default,
        id: pokemonDetails.id
    }

    return pokemonObject;
}

// on page load
buildPokemonElements(getAllPokemon);
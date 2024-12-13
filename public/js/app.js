const pokemonGallery = document.getElementById('pokemon-gallery');
const searchInput = document.getElementById('search-input');

let allPokemonData = [];
let offset = 0;
let limit = 15;
let isSearching = false;

window.addEventListener('scroll', async () => {
    if (isSearching) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        offset += limit;
        const nextPokemonChunk = await getPokemonChunk(offset, limit);
        renderPokemonGallery(nextPokemonChunk);
    }
});

searchInput.addEventListener('input', async (event) => {
    const userInput = searchInput.value.toLowerCase().trim();
    isSearching = true;

    const filteredPokemon = allPokemonData.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(userInput)
    });

    if (filteredPokemon.length === 0) {
        pokemonGallery.innerHTML = `
            <div class='flex justify-center items-center w-full h-full col-span-1 sm:col-span-3 xl:cos-span-5'>
                <p class="font-bold px-4 py-2 bg-red-200 text-red-800 rounded-md">No Pokémon found matching "${userInput}".</p>
            </div>
        `;
        return;
    }

    if (userInput === '') {
        isSearching = false;
        offset = 0;
        limit = 15;
        pokemonGallery.innerHTML = '';

        const initialPokemonChunk = await getPokemonChunk(offset, limit);
        renderPokemonGallery(initialPokemonChunk);
        return;
    }

    pokemonGallery.innerHTML = '';
    renderPokemonGallery(filteredPokemon);
})

const buildPokemonElements = async (getPokemon) => {
    const allPokemon = await getPokemon();

    renderPokemonGallery(allPokemon);
}

async function renderPokemonGallery(pokemonList) {
    pokemonList.forEach(async (pokemon) => {
        const { name, type, image, id } = await getPokemonDetails(pokemon.url);

        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-selectiveYellow dark:border-skyBlue rounded-lg shadow-lg shadow-selectiveYellow dark:shadow-skyBlue bg-prussianBlue dark:bg-black text-skyBlue';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='./pokemon-details.html?id=${id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" loading='lazy' />
            </a>
            <p key=${id} class='text-lg font-semibold capitalize text-utOrange dark:text-selectiveYellow'>${name}</p>
            <p class='capitalize italic'>${type}</p>
        `;

        pokemonGallery.appendChild(pokemonCard);
    });
}

async function getPokemonChunk(offset = 0, limit = 15) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    return data.results;
}

async function getAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1010&offset=0');
    const data = await response.json();

    return data.results;
}

// get all pokemon data, used for search functionality
allPokemonData = await getAllPokemon();

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

// on page load load the first 15 pokemon
buildPokemonElements(getPokemonChunk);
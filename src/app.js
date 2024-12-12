const pokemonGallery = document.getElementById('pokemon-gallery');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

searchButton.addEventListener('click', async () => {
    const userInput = searchInput.value.toLowerCase().trim();
    const {name, type, image, id} = await getSearchInput(userInput);

    pokemonGallery.innerHTML = '';

    const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-utOrange rounded-lg shadow-lg shadow-utOrange bg-prussianBlue text-skyBlue';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='/src/pages/pokemon-details.html?id=${id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" />
            </a>
            <p key=${id} class='text-lg font-semibold capitalize'>${name}</p>
            <p class='capitalize italic'>${type}</p>
        `;

        pokemonGallery.appendChild(pokemonCard);
})

searchInput.addEventListener('change', (event) => {
    console.log(event);
})

const buildPokemonElements = async (getAllPokemonData) => {
    const allPokemon = await getAllPokemonData();

    allPokemon.forEach(async (pokemon) => {
        const { name, type, image, id } = await getPokemonDetails(pokemon.url);

        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-utOrange rounded-lg shadow-lg shadow-utOrange bg-prussianBlue text-skyBlue';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='/src/pages/pokemon-details.html?id=${id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" />
            </a>
            <p key=${id} class='text-lg font-semibold capitalize'>${name}</p>
            <p class='capitalize italic'>${type}</p>
        `;

        pokemonGallery.appendChild(pokemonCard);
    });
}

async function getAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0');
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

async function getSearchInput(input) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
    const pokemon = await response.json();
    console.log(pokemon);
    return {
        name: pokemon.name,
        type: pokemon.types[0].type.name,
        image: pokemon.sprites.other['official-artwork'].front_default,
        id: pokemon.id,
    }
}

// on page load
buildPokemonElements(getAllPokemon);
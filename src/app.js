const pokemonGallery = document.getElementById('pokemon-gallery');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const error = document.getElementById('error-msg');

let allPokemonData = [];

searchButton.addEventListener('click', async () => {
    const userInput = searchInput.value.toLowerCase().trim();

    const pokemon = allPokemonData.find(pokemon =>
        pokemon.name === userInput
    )

    if (!pokemon) {
        error.classList.remove('opacity-0', 'scale-90', 'hidden');
        error.classList.add('opacity-100', 'scale-100');
    } else {
        error.classList.remove('opacity-100', 'scale-100');
        error.classList.add('opacity-0', 'scale-90', 'hidden');
        
        const { name, type, image, id } = await getPokemonDetails(pokemon.url);

        pokemonGallery.innerHTML = '';

        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'flex flex-col items-center justify-center p-2 border border-utOrange rounded-lg shadow-lg shadow-utOrange bg-prussianBlue text-skyBlue';
        pokemonCard.innerHTML = `
            <p class='text-lg font-semibold self-end'>${id}</p>
            <a href='/src/pages/-details.html?id=${id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
            <img src=${image} alt=${name} class="w-[10rem] h-auto" />
            </a>
            <p key=${id} class='text-lg font-semibold capitalize'>${name}</p>
            <p class='capitalize italic'>${type}</p>
        `;

        pokemonGallery.appendChild(pokemonCard);

    }
})

searchInput.addEventListener('input', async (event) => {
    const userInput = searchInput.value.toLowerCase().trim();
    console.log(userInput)

    const filteredPokemon = allPokemonData.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(userInput)
    });

    console.log(filteredPokemon)

    renderPokemonGallery(filteredPokemon);

})

const buildPokemonElements = async (getAllPokemonData) => {
    const allPokemon = await getAllPokemonData();
    allPokemonData = allPokemon;

    renderPokemonGallery(allPokemon);
}

async function renderPokemonGallery(pokemonList) {
    pokemonGallery.innerHTML = '';

    pokemonList.forEach(async (pokemon) => {
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

// on page load
buildPokemonElements(getAllPokemon);
const pokemonDetailsContainer = document.getElementById('pokemon-details');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('id');
console.log(pokemonId);

if (!pokemonId) {
    console.error('Pokemon ID is missing in the URL.');
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-red-500 text-center';
    errorMessage.textContent = 'Error: Missing Pokémon ID in the URL.';
    pokemonDetailsContainer.appendChild(errorMessage);
    throw new Error('Missing Pokémon ID.');
}

const getPokemonDetailsById = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();

    return {
        name: pokemon.name,
        id: pokemon.id,
        image: pokemon.sprites.other['official-artwork'].front_default,
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        moves: pokemon.moves.slice(0, 5).map(move => move.move.name),
        stats: pokemon.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
        })),
    };
};

const getPokemonEvolutions = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await response.json();
    const evolutionURL = data.evolution_chain.url;

    const evolutionChainResponse = await fetch(evolutionURL);
    const evolutionChainData = await evolutionChainResponse.json();

    let currentStage = evolutionChainData.chain;
    const evolutions = [];

    while (currentStage) {
        // Add the species name if it's not already in the array
        if (!evolutions.includes(currentStage.species.name)) {
            evolutions.push(currentStage.species.name);
        }

        // If there are multiple evolutions, add them all (while avoiding duplicates)
        if (currentStage.evolves_to.length > 1) {
            currentStage.evolves_to.forEach(stage => {
                if (!evolutions.includes(stage.species.name)) {
                    evolutions.push(stage.species.name);
                }
            });
        }

        // Move to the next stage in the evolution chain
        currentStage = currentStage.evolves_to[0];
    }
    return evolutions;
}

async function createEvolutionObjects(evolutions) {
    const evolutionObjects = [];
    for (let i = 0; i < evolutions.length; i++) {
        console.log(evolutions[i]);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutions[i]}`);

        console.log(response);

        if (!response.ok) {
            displayErrorMessage();
        }
        const pokemon = await response.json();

        evolutionObjects.push({
            name: pokemon.name,
            id: pokemon.id,
            image: pokemon.sprites.other['official-artwork'].front_default,
        });
    }

    return evolutionObjects;
};

const evolutionChain = await getPokemonEvolutions(pokemonId);
const pokemonEvolutions = await createEvolutionObjects(evolutionChain);

const renderPokemonDetails = async () => {
    showLoadingSpinner();
    const pokemon = await getPokemonDetailsById(pokemonId);
    const flavorText = await getEnglishFlavorText(pokemonId);
    const uniqueFlavorTextEntries = getUniqueEntries(flavorText);
    const parsedFlavorTextEntries = parseUniqueEntries(uniqueFlavorTextEntries);
    const randomFlavorText = getRandomFlavorText(parsedFlavorTextEntries);

    console.log(pokemon);

    if (!pokemon) {
        displayErrorMessage();
    }

    const pokemonDetails = document.createElement('div');
    pokemonDetails.className = 'flex flex-col gap-4 items-center justify-center py-6 px-4 xs:px-8 sm:px-12 border border-utOrange dark:border-blueGreen rounded-lg bg-prussianBlue dark:bg-black text-skyBlue shadow-lg shadow-utOrange dark:shadow-blueGreen xxs:w-[90%] sm:w-[80%] text-pretty';
    pokemonDetails.innerHTML = `
        <p class='text-3xl text-selectiveYellow font-semibold self-start'>${pokemon.id}</p>

        <div class='flex flex-col sm:flex-row items-center justify-around gap-8 mb-8'>
            <div class='flex flex-col items-center justify-center gap-4'>
                <img src=${pokemon.image} alt=${pokemon.name} class="w-[10rem] sm:w-[20rem] h-auto" loading='lazy' />
                <p key=${pokemon.id} class='text-3xl sm:text-4xl decoration-utOrange underline underline-offset-4 font-semibold capitalize'>${pokemon.name}</p>
            </div>
            <div class='flex flex-col gap-4'>
                <div>
                    <p class='font-semibold text-lg text-selectiveYellow'>Abilities</p>
                    <p class='capitalize'>${pokemon.abilities.join(', ')}</p>
                </div>

                <div>
                    <p class='font-semibold text-lg text-selectiveYellow'>Moves</p>
                    <p class='capitalize'>${pokemon.moves.join(', ')}</p>
                </div>

                <div>
                    <p class='font-semibold text-lg text-selectiveYellow'>Stats</p>
                    <p class='capitalize'>${pokemon.stats.map(stat => `${stat.name}: ${stat.value}`).join(', ')}</p>
                </div>
            </div>
        </div>

        <div class='flex flex-col gap-4 mb-8'>
            <p class='text-xl text-selectiveYellow font-semibold'>Evolutions</p>
            <div class='grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 items-center justify-around gap-8'>
                ${pokemonEvolutions.map(evolution => `
                    <div class='flex flex-col items-center justify-center gap-4'>
                        <a href='./pokemon-details.html?id=${encodeURIComponent(evolution.id)}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
                            <img src=${evolution.image} alt=${evolution.name} class="w-[10rem] h-auto" />
                        </a>
                        <p class='text-lg font-semibold capitalize'>${evolution.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class='flex flex-col gap-4 mb-4'>
            <p class='text-xl text-selectiveYellow font-semibold'>Fun Factoid</p>
            <p>${randomFlavorText}</p>
        </div>
    `;

    hideLoadingSpinner();
    pokemonDetailsContainer.appendChild(pokemonDetails);
};

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'flex items-center justify-center h-screen';
    spinner.innerHTML = `
        <svg class="animate-spin h-40 w-40 text-utOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291V16a8 8 0 008 8h0v-2.291A6 6 0 016 17.291z"></path>
        </svg>
    `;
    pokemonDetailsContainer.innerHTML = '';
    pokemonDetailsContainer.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('#loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

async function getEnglishFlavorText(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await response.json();

    return data.flavor_text_entries.filter(entry => entry.language.name === 'en').map(entry => entry.flavor_text);
}

function getUniqueEntries(entries) {
    return entries.filter((text, index, array) => {
        return array.indexOf(text) === index;
    });
};

function parseUniqueEntries(entries) {
    return entries.map(text =>
        text.replace(/[\n\f]/g, ' ')
            .replace(/…/g, '...')
            .replace(/\s+/g, ' ')
            .trim()
    );
};

function getRandomFlavorText(flavorText) {
    return flavorText[Math.floor(Math.random() * flavorText.length)];
}

function displayErrorMessage() {
    console.error('Pokemon not found.');
    const errorMessage = document.createElement('p');
    errorMessage.className = 'font-bold px-4 py-2 bg-red-200 text-red-800 rounded-md';
    errorMessage.textContent = 'Error: Pokémon not found.';
    pokemonDetailsContainer.appendChild(errorMessage);
    return;
}

renderPokemonDetails();
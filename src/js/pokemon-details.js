const pokemonDetailsContainer = document.getElementById('pokemon-details');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('id');

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
    console.log('Here are the evolution data: ', evolutionChainData)

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
    console.log('Here is the evolutions array: ', evolutions);
    return evolutions;
}

async function createEvolutionObjects(evolutions) {
    console.log('Here is the evolutions array arg: ', evolutions)
    const evolutionObjects = [];
    for (let i = 0; i < evolutions.length; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutions[i]}`);
        const pokemon = await response.json();
        evolutionObjects.push({
            name: pokemon.name,
            id: pokemon.id,
            image: pokemon.sprites.other['official-artwork'].front_default,
        });
    }

    console.log('Here is the evolution objects array: ', evolutionObjects)
    return evolutionObjects;
};

const evolutionChain = await getPokemonEvolutions(pokemonId);
const pokemonEvolutions = await createEvolutionObjects(evolutionChain);

const renderPokemonDetails = async () => {
    const pokemon = await getPokemonDetailsById(pokemonId);

    const pokemonDetails = document.createElement('div');
    pokemonDetails.className = 'flex flex-col gap-4 items-center justify-center py-6 px-12 border border-utOrange rounded-lg bg-prussianBlue text-skyBlue shadow-lg shadow-utOrange xxs:w-[90%] sm:w-[80%] text-pretty';
    pokemonDetails.innerHTML = `
        <p class='text-3xl text-selectiveYellow font-semibold self-start'>${pokemon.id}</p>

        <div class='flex flex-col sm:flex-row items-center justify-around gap-8 mb-8'>
            <div class='flex flex-col items-center justify-center gap-4'>
                <img src=${pokemon.image} alt=${pokemon.name} class="w-[10rem] sm:w-[20rem] h-auto" />
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

        <div class='flex flex-col gap-4'>
            <p class='text-xl text-selectiveYellow font-semibold'>Evolutions</p>
            <div class='grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 items-center justify-around gap-8'>
                ${pokemonEvolutions.map(evolution => `
                    <div class='flex flex-col items-center justify-center gap-4'>
                        <a href='/src/pages/pokemon-details.html?id=${evolution.id}' class='hover:-translate-y-1 hover:scale-105 transition-all ease-in'>
                            <img src=${evolution.image} alt=${evolution.name} class="w-[10rem] h-auto" />
                        </a>
                        <p class='text-lg font-semibold capitalize'>${evolution.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    pokemonDetailsContainer.appendChild(pokemonDetails);
};

renderPokemonDetails();
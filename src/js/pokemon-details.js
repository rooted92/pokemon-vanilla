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
}

const renderPokemonDetails = async () => {
    const pokemon = await getPokemonDetailsById(pokemonId);

    const pokemonDetails = document.createElement('div');
    pokemonDetails.className = 'flex flex-col gap-4 items-center justify-center py-6 px-12 border border-utOrange rounded-lg bg-prussianBlue text-skyBlue shadow-lg shadow-utOrange w-[80%]';
    pokemonDetails.innerHTML = `
        <p class='text-lg font-semibold self-end'>${pokemon.id}</p>
        <div class='flex items-center justify-around gap-8'>
            <div class='flex flex-col gap-4'>
                <img src=${pokemon.image} alt=${pokemon.name} class="w-[20rem] h-auto" />
                <p key=${pokemon.id} class='text-4xl font-semibold capitalize'>${pokemon.name}</p>
            </div
            <div class='flex flex-col gap-4'>
                <p class='capitalize'>Abilities: ${pokemon.abilities.join(', ')}</p>
                <p class='capitalize'>Moves: ${pokemon.moves.join(', ')}</p>
                <p class='capitalize'>Stats: ${pokemon.stats.map(stat => `${stat.name}: ${stat.value}`).join(', ')}</p>
            </div>
        </div>
        
        
    `;

    pokemonDetailsContainer.appendChild(pokemonDetails);
};

renderPokemonDetails();
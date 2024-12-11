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
    pokemonDetails.className = 'flex flex-col gap-4 items-center justify-center p-6 border border-orangeWeb rounded-lg bg-oxfordBlue text-platinum shadow-lg shadow-orangeWeb w-[80%]';
    pokemonDetails.innerHTML = `
        <p class='text-lg font-semibold self-end'>${pokemon.id}</p>
        <img src=${pokemon.image} alt=${pokemon.name} class="w-[30rem] h-auto" />
        <p key=${pokemon.id} class='text-4xl font-semibold capitalize'>${pokemon.name}</p>
        <p class='capitalize self-start'>Abilities: ${pokemon.abilities.join(', ')}</p>
        <p class='capitalize self-start'>Moves: ${pokemon.moves.join(', ')}</p>
        <p class='capitalize self-start'>Stats: ${pokemon.stats.map(stat => `${stat.name}: ${stat.value}`).join(', ')}</p>
    `;

    pokemonDetailsContainer.appendChild(pokemonDetails);
};

renderPokemonDetails();
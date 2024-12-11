const pokemonDetailsContainer = document.getElementById('pokemon-details');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('id');
console.log(pokemonId);

const getPokemonDetailsById = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    console.log(pokemon);
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
    pokemonDetails.className = 'flex flex-col items-center justify-center p-2 border border-gray-300 rounded-lg shadow-lg';
    pokemonDetails.innerHTML = `
        <p class='text-lg font-semibold self-end'>${pokemon.id}</p>
        <img src=${pokemon.image} alt=${pokemon.name} class="w-[10rem] h-auto" />
        <p key=${pokemon.id} class='text-lg font-semibold'>${pokemon.name}</p>
        <p>Abilities: ${pokemon.abilities.join(', ')}</p>
        <p>Moves: ${pokemon.moves.join(', ')}</p>
        <p>Stats: ${pokemon.stats.map(stat => `${stat.name}: ${stat.value}`).join(', ')}</p>
    `;

    pokemonDetailsContainer.appendChild(pokemonDetails);
};

renderPokemonDetails();
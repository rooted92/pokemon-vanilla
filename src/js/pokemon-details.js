const pokemonDetailsContainer = document.getElementById('pokemon-details');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('id');
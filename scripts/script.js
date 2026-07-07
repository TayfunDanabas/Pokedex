let limit = 20;
let offset = 0;
let allPokemon = [];

async function fetchPokemon() {
    showLoadingScreen();
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await response.json();
        await renderPokemon(data.results);
        hideLoadingScreen();
    } catch (error) {
        hideLoadingScreen();
    }
}

function appendPokemonCards(pokemonDataList) {
    const renderRef = document.getElementById("pokemonContent");
    pokemonDataList.forEach(pokemonData => {
        const type = pokemonData.types[0].type.name;
        allPokemon.push(pokemonData);
        renderRef.innerHTML += templateContent(pokemonData, type, allPokemon.length - 1);
    });
    if (typeof refreshVisiblePokemonList === "function") refreshVisiblePokemonList();
}

async function renderPokemon(pokemonList) {
    const pokemonDataList = await Promise.all(
        pokemonList.map(pokemon => fetchPokemonData(pokemon.url))
    );
    appendPokemonCards(pokemonDataList);
}

function showLoadingScreen() {
    document.getElementById("loadingScreen").classList.remove("hidden");
    document.getElementById("load-more-button").disabled = true;
}

function hideLoadingScreen() {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("load-more-button").disabled = false;
}

async function fetchPokemonData(url) {
    const response = await fetch(url);
    return await response.json();
}

async function loadMorePokemon() {
    offset += limit;
    await fetchPokemon();
}
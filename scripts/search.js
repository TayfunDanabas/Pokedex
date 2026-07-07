function validateSearchInput() {
    let input = document.getElementById("search-input").value.trim();

    if (input.length === 0) {
        resetSearch();
        return;
    }
    if (input.length < 3) {
        showSearchError();
        return;
    }
    clearSearchError();
}

function resetSearch() {
    document.getElementById("searchError").innerText = "";
    document.getElementById("search-button").disabled = true;
    toggleLoadMoreBtn(true);
    filterCards("");
}

function showSearchError() {
    document.getElementById("searchError").innerText = "Enter at least 3 letters";
    document.getElementById("search-button").disabled = true;
}

function clearSearchError() {
    document.getElementById("searchError").innerText = "";
    document.getElementById("search-button").disabled = false;
}

function searchPokemon() {
    let input = document.getElementById("search-input").value.toLowerCase().trim();
    if (input.length < 3) return;

    toggleLoadMoreBtn(false);
    filterCards(input);
}

function toggleLoadMoreBtn(show) {
    let loadMoreBtn = document.getElementById("load-more-button");
    loadMoreBtn.classList.toggle("loadMoreBtn", show);
    loadMoreBtn.classList.toggle("hidden", !show);
}

function filterCards(input) {
    let cards = document.getElementsByClassName("pokemon_card");
    let hasMatches = false;
    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].getElementsByTagName("h2")[0].innerText.toLowerCase();
        let matches = name.includes(input);
        cards[i].closest("li").classList.toggle("hidden", !matches);
        if (matches) hasMatches = true;
    }
    updateNotFoundMessage(hasMatches);
}

function updateNotFoundMessage(hasMatches) {
    let notFound = document.querySelector('.not-found');
    if (!notFound) {
        notFound = document.createElement("li");
        notFound.classList.add("not-found");
        const text = document.createElement("p");
        text.innerText = "No match found.";
        notFound.appendChild(text);
        document.getElementById("pokemonContent").appendChild(notFound);
    }
    notFound.classList.toggle("hidden", hasMatches);
}
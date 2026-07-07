let currentCardIndex = null;
let currentTab = "info";
let pokemonDetailCache = {};
let scrollPosition = 0;

const statLabels = {
    "hp": "HP",
    "attack": "Attack",
    "defense": "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    "speed": "Speed"
};

function openCard(index) {
    currentCardIndex = index;
    currentTab = "info";
    scrollPosition = window.scrollY;
    
    document.body.classList.add("card-open");
    document.body.style.top = `-${scrollPosition}px`;
    document.getElementById("dialog").showModal();

    renderCard();
}

function closeCard() {
    document.getElementById("dialog").close();
    document.body.classList.remove("card-open");
    document.body.style.top = "";
    
    window.scrollTo(0, scrollPosition);
    currentCardIndex = null;
}

function overlayClick(event) {
    if (event.target.id === "dialog") closeCard();
}

function navigateCard(step) {
    const nextIndex = currentCardIndex + step;
    if (nextIndex < 0 || nextIndex >= allPokemon.length) return;
    currentCardIndex = nextIndex;
    renderCard();
}

function goToPokemonByName(name) {
    const index = allPokemon.findIndex(p => p.name === name);
    if (index === -1) return;
    currentCardIndex = index;
    renderCard();
}

function switchTab(tab) {
    currentTab = tab;
    updateTabButtons();
    renderTabPanel();
}

async function renderCard() {
    const pokemonData = allPokemon[currentCardIndex];
    const type = pokemonData.types[0].type.name;

    document.getElementById("dialog").className = `card-content ${type}`;
    updateNavButtons();

    document.getElementById("cardBody").innerHTML =
        templateHeaderSection(pokemonData, type) + templateTabsSection(currentTab);

    updateTabButtons();
    renderTabPanel();
}

function updateNavButtons() {
    document.getElementById("prev-button").disabled = currentCardIndex === 0;
    document.getElementById("next-button").disabled = currentCardIndex === allPokemon.length - 1;
}

function updateTabButtons() {
    document.querySelectorAll(".tab_btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === currentTab);
    });
}

function renderTabPanel() {
    const pokemonData = allPokemon[currentCardIndex];

    if (currentTab === "info") {
        document.getElementById("tabPanel").innerHTML = renderInfoPanel(pokemonData);
    } else if (currentTab === "stats") {
        document.getElementById("tabPanel").innerHTML = templateStatsPanel(buildStatRows(pokemonData.stats));
    } else {
        renderEvolutionPanel(pokemonData);
    }
}

function renderInfoPanel(pokemonData) {
    const heightM = (pokemonData.height / 10).toFixed(1);
    const weightKg = (pokemonData.weight / 10).toFixed(1);
    const abilityNames = [];
    for (let i = 0; i < pokemonData.abilities.length; i++) {
        const a = pokemonData.abilities[i];
        abilityNames.push(a.ability.name.replace("-", " "));
    }
    const abilities = abilityNames.join(", ");

    return templateInfoPanel(heightM, weightKg, abilities);
}

function buildStatRows(stats) {
    const rows = [];
    for (let i = 0; i < stats.length; i++) {
        const s = stats[i];
        rows.push({
            label: statLabels[s.stat.name] || s.stat.name,
            value: s.base_stat
        });
    }
    return rows;
}

async function fetchEvolutionChain(pokemonData) {
    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = await speciesRes.json();
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
    const names = [];
    function traverse(node) {
        names.push(node.species.name);
        node.evolves_to.forEach(traverse);
    }
    traverse(evoData.chain);

    return names;
}

async function renderEvolutionStages(stageNames, requestIndex, requestTab) {
    for (let i = 0; i < stageNames.length; i++) {
        const pokemon = await fetchPokemonForEvolution(stageNames[i]);
        if (requestIndex !== currentCardIndex || requestTab !== currentTab) return;
        const list = document.getElementById("evolutionList");
        if (list) list.insertAdjacentHTML("beforeend", templateEvolutionStage(pokemon, i, stageNames.length));
    }
}

async function renderEvolutionPanel(pokemonData) {
    const requestIndex = currentCardIndex;
    const requestTab = currentTab;
    document.getElementById("tabPanel").innerHTML = `<div class="evolution-list" id="evolutionList"></div>`;

    try {
        const stageNames = await fetchEvolutionChain(pokemonData);
        await renderEvolutionStages(stageNames, requestIndex, requestTab);
    } catch (error) {
        if (requestIndex !== currentCardIndex || requestTab !== currentTab) return;
        document.getElementById("tabPanel").innerText = "Evolution data unavailable";
    }
}

async function fetchPokemonForEvolution(name) {
    if (pokemonDetailCache[name]) return pokemonDetailCache[name];

    const cached = allPokemon.find(p => p.name === name);
    if (cached) {
        pokemonDetailCache[name] = cached;
        return cached;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    pokemonDetailCache[name] = data;
    return data;
}
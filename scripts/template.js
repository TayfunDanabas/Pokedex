function templateContent(pokemonData, type, index) {
    const typeIcons = pokemonData.types
        .map(t => `
            <div class="icon_typ_style ${t.type.name}">
                <img src="./assets/icons/${t.type.name}.svg" alt="${t.type.name}">
            </div>
        `)
        .join("");

    return `
        <li>
            <button class="pokemon_card" data-id="card" aria-label="View ${pokemonData.name} details" onclick="openCard(${index})">
                <header class="header_card">
                    <p>#${pokemonData.id}</p>
                    <h2>${pokemonData.name}</h2>
                </header>

                <section class="main_card ${type}">
                    <img data-id="card-image" src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}">
                </section>

                <footer class="footer_card">
                    ${typeIcons}
                </footer>
            </button>
        </li>
    `;
}

function templateHeaderSection(pokemonData, type) {
    return `
        <header class="card-header">
            <p>#${pokemonData.id}</p>
            <h2>${pokemonData.name}</h2>
        </header>
        <section class="card-main ${type}">
            <img data-id="dialog-image" src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}">
        </section>
    `;
}

function templateTabsSection(activeTab) {
    return `
        <div class="card-tabs">
            ${templateTabButton("info", "Info", activeTab)}
            ${templateTabButton("stats", "Stats", activeTab)}
            ${templateTabButton("evolution", "Evolution", activeTab)}
        </div>
        <div id="tabPanel" class="card-tab-panel"></div>
    `;
}

function templateTabButton(tab, label, activeTab) {
    return `<button class="tab_btn${tab === activeTab ? " active" : ""}" data-tab="${tab}" aria-label="Show ${label} tab" onclick="switchTab('${tab}')">${label}</button>`;
}

function templateInfoPanel(heightM, weightKg, abilities) {
    return `
        <div class="info_grid">
            ${templateInfoItem("Height", `${heightM} m`)}
            ${templateInfoItem("Weight", `${weightKg} kg`)}
            ${templateInfoItem("Abilities", abilities, true)}
        </div>
    `;
}

function templateInfoItem(label, value, wide) {
    return `
        <div class="info_item${wide ? " info_item_wide" : ""}">
            <span class="info_label">${label}</span>
            <span class="info_value">${value}</span>
        </div>
    `;
}

function templateStatsPanel(statRows) {
    return `
        <div class="info_grid">
            ${statRows.map(row => templateInfoItem(row.label, row.value)).join("")}
        </div>
    `;
}

function templateEvolutionStage(pokemon, i, total) {
    return `
        <div class="evolution_stage">
            <div class="evolution_stage_item ${pokemon.types[0].type.name}" role="button" tabindex="0" aria-label="View ${pokemon.name} details" onclick="goToPokemonByName('${pokemon.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();goToPokemonByName('${pokemon.name}');}">
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
            </div>
            ${i < total - 1 ? `<img class="evolution_arrow" src="./assets/icons/arrow-right.svg" alt="arrow">` : ""}
        </div>
    `;
}
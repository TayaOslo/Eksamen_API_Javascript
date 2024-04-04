document.addEventListener("DOMContentLoaded", async function () {
  const pokemonContainer = document.querySelector(".pokemon-container");
  const typeButtonsContainer = document.querySelector(
    ".type-buttons-container"
  );
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  let allPokemonList = [];
  let filteredPokemonList = [];

  async function fetchPokemonList() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=50");
    const data = await response.json();
    return data.results;
  }

  async function fetchPokemonDetails(pokemonUrl) {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
  }

  async function fetchAndShowPokemon() {
    try {
      const pokemonList = await fetchPokemonList();
      allPokemonList = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const details = await fetchPokemonDetails(pokemon.url);
          return details;
        })
      );
      showAllPokemon(allPokemonList);
    } catch (error) {
      console.error("Oops, could not load Pokémon list", error);
    }
  }

  function showAllPokemon(pokemonList) {
    pokemonContainer.innerHTML = "";
    pokemonList.forEach((pokemon) => {
      showPokemon(pokemon);
    });
  }

  function showPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    const imageElement = document.createElement("img");
    imageElement.src = pokemon.sprites.front_default;
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

    const firstType = pokemon.types[0].type.name;
    const backgroundColor = getTypeColor(firstType);

    pokemonCard.style.backgroundColor = backgroundColor;

    const typeButton = document.createElement("button");
    typeButton.classList.add("type-btn");
    typeButton.textContent =
      firstType.charAt(0).toUpperCase() + firstType.slice(1);
    typeButton.style.backgroundColor = backgroundColor;

    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("btn", "save-btn");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "delete-btn");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "edit-btn");

    actionButtons.appendChild(saveButton);
    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(editButton);

    pokemonCard.appendChild(imageElement);
    pokemonCard.appendChild(nameElement);
    pokemonCard.appendChild(typeButton);
    pokemonCard.appendChild(actionButtons);

    pokemonContainer.appendChild(pokemonCard);
  }

  function getTypeColor(type) {
    const typeColors = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD",
    };
    return typeColors[type] || "#999";
  }

  Object.keys(typeColors).forEach((type) => {
    const button = document.createElement("button");
    button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    button.style.backgroundColor = getTypeColor(type);
    button.addEventListener("click", () => {
      filterPokemonByType(type);
    });
    typeButtonsContainer.appendChild(button);
  });

  const clearFilterButton = document.createElement("button");
  clearFilterButton.textContent = "Clear Filters";
  clearFilterButton.addEventListener("click", () => {
    filterPokemonByType("all");
  });
  typeButtonsContainer.appendChild(clearFilterButton);

  function filterPokemonByType(type) {
    if (type === "all") {
      showAllPokemon(allPokemonList);
    } else {
      filteredPokemonList = allPokemonList.filter(
        (pokemon) => pokemon.types[0].type.name === type
      );
      showAllPokemon(filteredPokemonList);
    }
  }

  fetchAndShowPokemon();
});

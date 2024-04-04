document.addEventListener("DOMContentLoaded", async function () {
  const pokemonContainer = document.querySelector(".pokemon-container");

  let allPokemonList = []; // Store all fetched Pokemon data

  async function fetchPokemonList() {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?offset=50&limit=50"
    );
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
      showAllPokemon();
    } catch (error) {
      console.error("Oops, could not load Pokémon list", error);
    }
  }

  function showAllPokemon() {
    pokemonContainer.innerHTML = ""; // Clear existing Pokemon
    allPokemonList.forEach((pokemon) => {
      showPokemon(pokemon);
    });
  }

  function showPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    /*const numberElement = document.createElement("p");
    numberElement.textContent = `Nr.${number}`;*/

    const imageElement = document.createElement("img");
    imageElement.src = pokemon.sprites.front_default;
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

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

    // Get the first type of the Pokémon
    const firstType = pokemon.types[0].type.name;

    // Create type button for the first type
    const typeButton = document.createElement("button");
    typeButton.classList.add("type-btn");
    typeButton.dataset.type = firstType;
    typeButton.textContent =
      firstType.charAt(0).toUpperCase() + firstType.slice(1); // Capitalize the type name
    typeButton.style.backgroundColor = typeColors[firstType] || "#999";
    typeButton.style.color = "white";

    // Create action buttons
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.classList.add("btn", "save-btn");

    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.classList.add("btn", "delete-btn");

    const editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.classList.add("btn", "edit-btn");

    actionButtons.appendChild(saveButton);
    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(editButton);

    pokemonCard.appendChild(imageElement);
    pokemonCard.appendChild(nameElement);
    pokemonCard.appendChild(typeButton);
    pokemonCard.appendChild(actionButtons); // Append action buttons to the Pokémon card

    pokemonContainer.appendChild(pokemonCard);
  }

  fetchAndShowPokemon();
});

document.addEventListener("DOMContentLoaded", async function () {
  const pokemonContainer = document.querySelector(".pokemon-container");

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
      for (const pokemon of pokemonList) {
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        showPokemon(pokemonDetails);
      }
    } catch (error) {
      console.error("Oops, could not load Pokémon list", error);
    }
  }

  let pokemonCounter = 1;

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

  function showPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    const numberElement = document.createElement("p");
    numberElement.textContent = `Nr.${pokemonCounter}`;
    pokemonCounter++;

    const imageElement = document.createElement("img");
    imageElement.src = pokemon.sprites.front_default;
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

    const type = pokemon.types[0].type.name;

    const typeColor = typeColors[type];
    if (typeColor) {
      pokemonCard.style.backgroundColor = typeColor;
    } else {
      pokemonCard.style.backgroundColor = "#999";
    }

    const typeElement = document.createElement("p");
    typeElement.textContent = `Type: ${type}`;

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.id = "save-btn";

    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.id = "delete-btn";

    const editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.id = "edit-btn";

    pokemonCard.appendChild(numberElement);
    pokemonCard.appendChild(imageElement);
    pokemonCard.appendChild(nameElement);
    pokemonCard.appendChild(typeElement);
    pokemonCard.appendChild(saveButton);
    pokemonCard.appendChild(deleteButton);
    pokemonCard.appendChild(editButton);

    pokemonContainer.appendChild(pokemonCard);
  }

  fetchAndShowPokemon();
});

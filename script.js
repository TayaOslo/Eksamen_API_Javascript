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

  let allPokemonList = []; // Store all fetched Pokemon data

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
    pokemonContainer.innerHTML = ""; // Clear existing Pokemon
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

    const typeNames = pokemon.types.map((type) => type.type.name);
    const backgroundColor = getTypeColor(typeNames[0]);

    // Apply background color based on type
    pokemonCard.style.backgroundColor = backgroundColor;

    // Create type buttons for all types
    typeNames.forEach((typeName) => {
      const typeButton = document.createElement("button");
      typeButton.classList.add("type-btn");
      typeButton.textContent =
        typeName.charAt(0).toUpperCase() + typeName.slice(1);
      typeButton.style.backgroundColor = getTypeColor(typeName);
      typeButton.addEventListener("click", () => {
        filterPokemonByType(typeName);
      });
      pokemonCard.appendChild(typeButton);
    });

    // Create action buttons
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
    pokemonCard.appendChild(actionButtons); // Append action buttons to the Pokémon card

    pokemonContainer.appendChild(pokemonCard);

    pokemonContainer.insertBefore(pokemonCard, pokemonContainer.firstChild); // Insert the new card at the beginning of the container
  }

  function getTypeColor(type) {
    return typeColors[type] || "#999"; // Default color if type not found
  }

  // Create buttons for each type
  Object.keys(typeColors).forEach((type) => {
    const button = document.createElement("button");
    button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    button.style.backgroundColor = getTypeColor(type);
    button.addEventListener("click", () => {
      filterPokemonByType(type);
    });
    typeButtonsContainer.appendChild(button);
  });

  // Create a button to remove all filters
  const clearFilterButton = document.createElement("button");
  clearFilterButton.textContent = "Clear Filters";
  clearFilterButton.addEventListener("click", () => {
    filterPokemonByType("all");
  });
  typeButtonsContainer.appendChild(clearFilterButton);

  // Handle form submission
  const createPokemonForm = document.getElementById("create-pokemon-form");
  createPokemonForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("pokemon-name").value.trim();
    const type = document.getElementById("pokemon-type").value.trim();
    if (name && type) {
      try {
        const newPokemon = { name, types: [{ type: { name } }] }; // Create a new Pokemon object with user input
        showPokemonForm(newPokemon, type); // Pass the type name to the showPokemonForm function
      } catch (error) {
        console.error("Error creating Pokémon", error);
      }
    } else {
      alert("Please enter both name and type for the Pokémon.");
    }
  });

  async function showPokemonForm(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    const imageElement = document.createElement("img");
    imageElement.src = "assets/pokemon.webp";
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

    try {
      // Fetch the type details from the API using the typeName entered by the user
      const typeResponse = await fetch(
        `https://pokeapi.co/api/v2/type/${typeName}`
      );
      if (!typeResponse.ok) {
        throw new Error("Failed to fetch Pokémon type.");
      }
      const typeData = await typeResponse.json();
      const typeName = typeData.name; // Extract the type name from the response

      // Determine background color based on the type name
      const backgroundColor = getTypeColor(typeName);

      pokemonCard.style.backgroundColor = backgroundColor;

      // Create and append type button
      const typeButton = document.createElement("button");
      typeButton.classList.add("type-btn");
      typeButton.textContent =
        typeName.charAt(0).toUpperCase() + typeName.slice(1);
      typeButton.style.backgroundColor = backgroundColor;
      typeButton.addEventListener("click", () => {
        filterPokemonByType(typeName);
      });
      pokemonCard.appendChild(typeButton);
    } catch (error) {
      console.error("Error fetching Pokémon type:", error);
      // Handle errors gracefully
    }

    /* // Create and append type button
      const typeButton = document.createElement("button");
      typeButton.textContent =
        typeData.name.charAt(0).toUpperCase() + typeData.name.slice(1);
      typeButton.classList.add("type-btn");
      typeButton.style.backgroundColor = backgroundColor;
      typeButton.addEventListener("click", () => {
        // Handle button click event if needed
      });
      pokemonCard.appendChild(typeButton);
    } catch (error) {
      console.error("Error fetching Pokémon type:", error);
    }*/

    /* const typeNames = pokemon.types.map((type) => type.type.name);
    const backgroundColor = getTypeColor(typeNames[0]);

    // Apply background color based on type
    pokemonCard.style.backgroundColor = backgroundColor;

    // Create type buttons for all types
    typeNames.forEach((typeName) => {
      const typeButton = document.createElement("button");
      typeButton.classList.add("type-btn");
      typeButton.textContent =
        typeName.charAt(0).toUpperCase() + typeName.slice(1);
      typeButton.style.backgroundColor = getTypeColor(typeName);
      typeButton.addEventListener("click", () => {
        filterPokemonByType(typeName);
      });
      pokemonCard.appendChild(typeButton);
    });*/

    // Create action buttons
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
    pokemonCard.appendChild(actionButtons); // Append action buttons to the Pokémon card

    pokemonContainer.insertBefore(pokemonCard, pokemonContainer.firstChild); // Insert the new card at the beginning of the container
  }

  function filterPokemonByType(type) {
    if (type === "all") {
      showAllPokemon(allPokemonList);
    } else {
      const filteredPokemon = allPokemonList.filter(
        (pokemon) => pokemon.types[0].type.name === type
      );
      showAllPokemon(filteredPokemon);
    }
  }

  fetchAndShowPokemon();
});

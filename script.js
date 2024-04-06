document.addEventListener("DOMContentLoaded", async function () {
  const pokemonContainer = document.querySelector(".pokemon-container");
  const typeButtonsContainer = document.querySelector(
    ".type-buttons-container"
  );
  const savedPokemonContainer = document.querySelector(
    ".saved-pokemon-container"
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
  let savedPokemonList = []; // Store saved Pokemon

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
    saveButton.addEventListener("click", () => {
      savePokemon(pokemon);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "delete-btn");
    deleteButton.addEventListener("click", () => {
      deletePokemon(pokemon, allPokemonList);
      pokemonContainer.removeChild(pokemonCard); // Remove the deleted Pokemon card from the container
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "edit-btn");
    editButton.addEventListener("click", () => {
      editPokemon(pokemon);
    });

    actionButtons.appendChild(saveButton);
    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(editButton);

    pokemonCard.appendChild(imageElement);
    pokemonCard.appendChild(nameElement);
    pokemonCard.appendChild(actionButtons); // Append action buttons to the Pokémon card

    pokemonContainer.appendChild(pokemonCard);
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

  let newPokemon; // Define newPokemon at a higher scope

  async function showPokemonForm(pokemon, type) {
    newPokemon = pokemon; // Assign the pokemon to newPokemon

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    const imageElement = document.createElement("img");
    imageElement.src = "assets/pokemon.webp";
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

    let typeButton; // Define typeButton variable outside of the event listener

    try {
      // Fetch the type details from the API using the typeName entered by the user
      const typeResponse = await fetch(
        `https://pokeapi.co/api/v2/type/${type}`
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
      typeButton = document.createElement("button"); // Assign typeButton here
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
      // If there's an error fetching the type, create a default type button
      typeButton = document.createElement("button");
      typeButton.classList.add("type-btn");
      typeButton.textContent = "Unknown Type";
      typeButton.style.backgroundColor = "#999"; // Default color
      pokemonCard.appendChild(typeButton);
    }

    // Create action buttons
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("btn", "save-btn");
    saveButton.addEventListener("click", () => {
      savePokemon(newPokemon);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "delete-btn");
    deleteButton.addEventListener("click", () => {
      deletePokemon(newPokemon, allPokemonList);
      pokemonContainer.removeChild(pokemonCard); // Remove the deleted Pokemon card from the container
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "edit-btn");

    editButton.addEventListener("click", () => {
      const newName = prompt(
        "Enter the new name for the Pokémon:",
        newPokemon.name
      );
      if (newName !== null && newName.trim() !== "") {
        newPokemon.name = newName.trim();
        nameElement.textContent = `Name: ${newPokemon.name}`;
      }

      const newType = prompt(
        "Enter the new type for the Pokémon:",
        newPokemon.types[0].type.name
      );
      if (newType !== null && newType.trim() !== "") {
        const typeName = newType.trim();
        newPokemon.types[0].type.name = typeName;
        const backgroundColor = getTypeColor(typeName);
        pokemonCard.style.backgroundColor = backgroundColor;
        typeButton.textContent =
          typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typeButton.style.backgroundColor = backgroundColor;
      }
    });

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

  function savePokemon(pokemon) {
    if (savedPokemonList.length < 5) {
      savedPokemonList.push(pokemon);
      showSavedPokemon();
    } else {
      alert(
        "You have reached the maximum limit of 5 saved Pokémon. Please delete a saved Pokémon to save more."
      );
    }
  }

  // Function to delete a Pokemon from the specified list
  function deletePokemon(pokemon, container) {
    const index = container.indexOf(pokemon);
    if (index !== -1) {
      container.splice(index, 1);
    }
  }

  let newType; // Declare newType variable outside of the function

  function editPokemon(pokemon) {
    const newName = prompt("Enter the new name for the Pokémon:", pokemon.name);
    newType = prompt(
      "Enter the new type for the Pokémon:",
      pokemon.types[0].type.name
    );

    if (newName !== null && newName.trim() !== "") {
      pokemon.name = newName.trim();
      pokemon.types[0].type.name = newType.trim(); // Update the type of the Pokemon

      // Update the type button in the Pokemon card
      const typeButton = pokemonContainer.querySelector(".type-btn");
      typeButton.textContent =
        newType.charAt(0).toUpperCase() + newType.slice(1);

      // Update the type button in the saved Pokemon card if applicable
      const savedPokemonCards =
        savedPokemonContainer.querySelectorAll(".pokemon");
      savedPokemonCards.forEach((card) => {
        if (card.textContent.includes(pokemon.name)) {
          const savedTypeButton = card.querySelector(".type-btn");
          savedTypeButton.textContent =
            newType.charAt(0).toUpperCase() + newType.slice(1);
        }
      });

      showAllPokemon(allPokemonList);
      showSavedPokemon();
    }
  }

  function showSavedPokemon() {
    savedPokemonContainer.innerHTML = ""; // Clear existing saved Pokémon display
    savedPokemonList.forEach((pokemon) => {
      const savedPokemonCard = document.createElement("div");
      savedPokemonCard.classList.add("pokemon");

      const imageElement = document.createElement("img");
      if (pokemon.sprites && pokemon.sprites.front_default) {
        imageElement.src = pokemon.sprites.front_default;
        imageElement.alt = pokemon.name;
      } else {
        imageElement.src = "assets/pokemon.webp"; // Default image source
        imageElement.alt = "Default Pokemon";
      }

      const nameElement = document.createElement("h2");
      nameElement.textContent = `Name: ${pokemon.name}`;

      // Create action buttons for saved Pokemon
      const actionButtons = document.createElement("div");
      actionButtons.classList.add("action-buttons");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "delete-btn");
      deleteButton.addEventListener("click", () => {
        deletePokemon(pokemon, savedPokemonList);
        savedPokemonContainer.removeChild(savedPokemonCard);
      });

      actionButtons.appendChild(deleteButton);

      savedPokemonCard.appendChild(imageElement);
      savedPokemonCard.appendChild(nameElement);
      savedPokemonCard.appendChild(actionButtons); // Append action buttons to the saved Pokémon card

      savedPokemonContainer.appendChild(savedPokemonCard);
    });
  }

  fetchAndShowPokemon();
});

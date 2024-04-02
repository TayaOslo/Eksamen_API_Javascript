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

  function showPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");

    const imageElement = document.createElement("img");
    imageElement.src = pokemon.sprites.front_default;
    imageElement.alt = pokemon.name;

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Name: ${pokemon.name}`;

    const type = pokemon.types[0].type.name;
    const typeElement = document.createElement("p");
    typeElement.textContent = `Type: ${type}`;


    pokemonCard.appendChild(imageElement);
    pokemonCard.appendChild(nameElement);
    pokemonCard.appendChild(typeElement);

    pokemonContainer.appendChild(pokemonCard);
  }

  fetchAndShowPokemon();
});

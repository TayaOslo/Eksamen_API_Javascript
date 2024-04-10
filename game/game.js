// Function to perform an attack
async function performAttack(attackerName, defenderName) {
  try {
    // Fetch data for attacker (user's Pokémon)
    const attackerResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${attackerName}`
    );
    const attackerData = await attackerResponse.json();

    // Fetch data for defender (opponent's Pokémon)
    const defenderResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${defenderName}`
    );
    const defenderData = await defenderResponse.json();

    // Randomly select an attack for the attacker
    const randomAttack =
      attackerData.moves[Math.floor(Math.random() * attackerData.moves.length)]
        .move.name;

    // Apply the attack on the defender
    alert(`${attackerName} used ${randomAttack} on ${defenderName}!`);
    // Update defender's HP
    const defenderHP = document.querySelector(".dark-container .hp");
    let currentHP = parseInt(defenderHP.innerText.replace("%", ""));
    currentHP = Math.max(currentHP - 10, 0); // Decrease HP by 10%
    defenderHP.innerText = `${currentHP}%`;

    // Check if defender's HP is 0% and display defeat prompt if so
    if (currentHP === 0) {
      alert(`${defenderName} was defeated!`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to perform a defense
async function performDefense(defenderName) {
  try {
    // Fetch data for defender (dark Pokémon)
    const defenderResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${defenderName}`
    );
    const defenderData = await defenderResponse.json();

    // Randomly select a defense move for the defender
    const randomDefense =
      defenderData.moves[Math.floor(Math.random() * defenderData.moves.length)]
        .move.name;

    // Restore HP for the defender (this is just a placeholder)
    const defenderHP = document.querySelector(".dark-container .hp");
    let currentHP = parseInt(defenderHP.innerText.replace("%", ""));
    currentHP += 5; // Restore 5 HP
    currentHP = Math.min(currentHP, 100); // Ensure HP doesn't exceed 100
    defenderHP.innerText = `${currentHP}%`;

    // Display the defense move
    alert(`${defenderName} used ${randomDefense} to defend and restored 5 HP!`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to perform an ally attack
async function performAllyAttack(attackerName, defenderName) {
  try {
    // Fetch data for attacker (ally Pokémon)
    const attackerResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${attackerName}`
    );
    const attackerData = await attackerResponse.json();

    // Fetch data for random defender (one of the three specified classes)
    const defenderClasses = ["butterfree", "squirtle", "charmander"];
    const randomDefenderClass =
      defenderClasses[Math.floor(Math.random() * defenderClasses.length)];
    const randomDefenderResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomDefenderClass}`
    );
    const randomDefenderData = await randomDefenderResponse.json();

    // Get defender's HP
    const defenderHP = document.querySelector(
      `.img-container.${randomDefenderClass} .hp`
    );
    let currentHP = parseInt(defenderHP.innerText.replace("%", ""));

    // Check if defender's HP is 0%
    if (currentHP === 0) {
      alert(`${randomDefenderData.name} has 0% HP and cannot be attacked!`);
      return; // Exit the function
    }

    // Randomly select an attack for the ally
    const randomAttack =
      attackerData.moves[Math.floor(Math.random() * attackerData.moves.length)]
        .move.name;

    // Apply the attack on the random defender
    alert(
      `${attackerName} used ${randomAttack} on ${randomDefenderData.name}!`
    );

    // Update defender's HP (decrease by 20%)
    currentHP = Math.max(currentHP - 20, 0); // Decrease HP by 20%
    defenderHP.innerText = `${currentHP}%`;

    // Check if defender's HP is 0% and display defeat prompt if so
    if (currentHP === 0) {
      alert(`${randomDefenderData.name} was defeated!`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Event listener for ally Pokémon attacks
document.querySelector(".ally-container").addEventListener("click", () => {
  const attackerName = document
    .querySelector(".ally")
    .getAttribute("data-pokemon");
  performAllyAttack(attackerName);
});

// Event listener for user's Pokémon attacks
document
  .querySelectorAll(".img-container:not(.dark-container)")
  .forEach((container) => {
    container.addEventListener("click", () => {
      const attackerName = container
        .querySelector(".pokemon")
        .getAttribute("data-pokemon");
      const defenderName = document
        .querySelector(".dark")
        .getAttribute("data-pokemon");
      performAttack(attackerName, defenderName);
    });
  });

// Event listener for "dark" Pokémon defense
document.querySelector(".dark-container").addEventListener("click", () => {
  const defenderName = document
    .querySelector(".dark")
    .getAttribute("data-pokemon");
  performDefense(defenderName);
});

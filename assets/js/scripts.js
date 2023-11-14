let ingredients = {};
let potions = {};
let ingredientDCs = {};
let userIngredients = {};

fetch("ingredientDCs.json")
  .then((response) => response.json())
  .then((data) => {
    ingredientDCs = data;
  })
  .catch((error) => {
    console.error("Error fetching ingredient DCs:", error);
  });

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function addIngredient() {
  let name = document.getElementById("ingredient-name").value;
  name = capitalizeWords(name); // Capitalize the ingredient name

  const amount = parseInt(document.getElementById("ingredient-amount").value);

  const dc = ingredientDCs[name]; // Fetch the DC from ingredientDCs object

  if (typeof dc === "undefined") {
    console.error(`No DC found for ingredient: ${name}`);
    return; // Exit the function if no DC is found for the ingredient
  }

  if (!ingredients[name]) {
    ingredients[name] = {
      amount: amount,
      dc: dc,
    };
  } else {
    ingredients[name].amount += amount;
  }

  // Clear the input fields
  document.getElementById("ingredient-name").value = "";
  document.getElementById("ingredient-amount").value = "";

  displayIngredients();

  // Save to localStorage:
  localStorage.setItem("ingredients", JSON.stringify(ingredients));

  // Update the displayed ingredients for all potions
  updateAllPotionsDisplay();
}

function displayIngredients() {
  let output = "";
  for (let name in ingredients) {
    output += `<div>
                    <span>${name}</span>: 
                    <span class="editable-amount" data-ingredient="${name}" contenteditable>${ingredients[name].amount}</span>
                    DC: ${ingredients[name].dc}
                 </div>`;
  }

  document.getElementById("ingredients-list").innerHTML = output;

  // Attach event listeners to each editable amount
  document.querySelectorAll(".editable-amount").forEach((el) => {
    el.addEventListener("blur", updateIngredientAmount);
  });
}

function updateIngredientAmount(event) {
  const ingredientName = event.target.getAttribute("data-ingredient");
  const newAmount = parseInt(event.target.innerText, 10);

  if (isNaN(newAmount) || newAmount < 0) {
    alert("Please enter a valid number!");
    event.target.innerText = ingredients[ingredientName].amount; // Reset the value to the original if the input is not valid
    return;
  }

  ingredients[ingredientName].amount = newAmount;

  // Save the updated ingredients to localStorage
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
}

function getIngredientDisplayText(ingredientName, requiredAmount) {
  const userAmount = ingredients[ingredientName]
    ? ingredients[ingredientName].amount
    : 0;
  return `${ingredientName} ${userAmount}/${requiredAmount}`;
}

function savePotionsToLocalStorage() {
  localStorage.setItem("potions", JSON.stringify(potions));
}

function addPotion() {
  const name = document.getElementById("potion-name").value;
  const effects = document.getElementById("potion-effects").value;
  const ingredientsInput = document.getElementById("potion-ingredients").value;

  // Split by comma to get individual ingredients and amounts
  const ingredientsPairs = ingredientsInput
    .split(",")
    .map((pair) => pair.trim());

  potions[name] = {
    effects: effects,
    ingredients: {},
    dc: 0, // Initialize with 0, we'll calculate this shortly
  };

  let totalDC = 10;

  // Array to hold the displayed ingredients, with user quantities
  let displayedIngredients = [];

  for (let pair of ingredientsPairs) {
    const match = pair.match(/(.*\S) (\d+)$/);
    if (match && match.length === 3) {
      const ingredientName = match[1].trim();
      const ingredientAmount = parseInt(match[2]);
      potions[name].ingredients[ingredientName] = ingredientAmount;

      // Add the DC for the ingredient to the totalDC
      if (ingredientDCs[ingredientName]) {
        totalDC += ingredientDCs[ingredientName];
      }

      // Append the ingredient display text with user's quantity
      const userAmount = ingredients[ingredientName]
        ? ingredients[ingredientName].amount
        : 0;
      displayedIngredients.push(
        `${ingredientName} ${userAmount}/${ingredientAmount}`
      );
    }
  }

  potions[name].dc = totalDC; // Update the potion's DC

  // Create the craft button here first
  let craftButton = document.createElement("button");
  craftButton.className = "craft-btn";
  craftButton.textContent = "Craft";

  let canCraft = true;
  for (let [ingredientName, requiredAmount] of Object.entries(
    potions[name].ingredients
  )) {
    if (
      !ingredients[ingredientName] ||
      ingredients[ingredientName].amount < requiredAmount
    ) {
      canCraft = false;
      break;
    }
  }
  if (!canCraft) {
    craftButton.disabled = true; // Disable the button
    craftButton.style.opacity = 0.5; // Make it look greyed out
  }

  craftButton.addEventListener("click", function () {
    craftPotion(name);
    // After crafting, check again if the potion can be crafted with the remaining ingredients
    let canStillCraft = true;
    for (let [ingredientName, requiredAmount] of Object.entries(
      potions[name].ingredients
    )) {
      if (
        !ingredients[ingredientName] ||
        ingredients[ingredientName].amount < requiredAmount
      ) {
        canStillCraft = false;
        break;
      }
    }
    if (!canStillCraft) {
      craftButton.disabled = true; // Disable the button
      craftButton.style.opacity = 0.5; // Make it look greyed out
    }
  });

  // Create the new potion element
  let potionItem = document.createElement("div");
  potionItem.className = "potion-item";
  potionItem.setAttribute("data-potion-name", name);

  let potionTitle = document.createElement("div");
  potionTitle.className = "potion-title";
  potionTitle.textContent = name; // Use the actual potion name

  let potionDetails = document.createElement("div");
  potionDetails.className = "potion-details hidden";

  let potionEffects = document.createElement("div");
  potionEffects.className = "potion-effects";
  potionEffects.textContent = "Potion Effects: " + effects; // Use the actual potion effects

  let potionIngredients = document.createElement("div");
  potionIngredients.className = "potion-ingredients";
  potionIngredients.textContent =
    "Ingredients: " + displayedIngredients.join(", ");

  // Add the DC to the potion's details
  let potionDC = document.createElement("div");
  potionDC.className = "potion-dc";
  potionDC.textContent = "DC: " + totalDC; // Use the calculated DC
  potionDetails.appendChild(potionDC);

  potionDetails.appendChild(potionEffects);
  potionDetails.appendChild(potionIngredients);
  potionDetails.appendChild(craftButton);

  potionItem.appendChild(potionTitle);
  potionItem.appendChild(potionDetails);

  // Add click event to the potion item to show/hide details
  potionTitle.addEventListener("click", function () {
    if (potionDetails.classList.contains("hidden")) {
      potionDetails.classList.remove("hidden");
    } else {
      potionDetails.classList.add("hidden");
    }
  });

  // Append the new potion item to the potions list
  document.getElementById("potions").appendChild(potionItem);

  // Append the new potion item to the potions list
  document.getElementById("potions").appendChild(potionItem);

  savePotionsToLocalStorage();
}

function craftPotion(potionName) {
  const potion = potions[potionName];
  let canCraft = true;

  // Check if the user has enough ingredients
  for (let [ingredientName, requiredAmount] of Object.entries(
    potion.ingredients
  )) {
    if (
      !ingredients[ingredientName] ||
      ingredients[ingredientName].amount < requiredAmount
    ) {
      canCraft = false;
      break;
    }
  }

  if (canCraft) {
    for (let [ingredientName, requiredAmount] of Object.entries(
      potion.ingredients
    )) {
      // Deduct the ingredients amounts
      ingredients[ingredientName].amount -= requiredAmount;
    }

    // Update the display for the ingredients list
    displayIngredients();

    // Update the display for this specific potion
    updatePotionDisplay(potionName);
  }

  savePotionsToLocalStorage();
}

function updatePotionDisplay(potionName) {
  const potionDisplay = document.querySelector(
    `[data-potion-name="${potionName}"] .potion-ingredients`
  );
  if (!potionDisplay) {
    console.error("No display found for potion:", potionName);
    return;
  }

  const potion = potions[potionName];

  // Generate the updated ingredients display text
  const ingredientsDisplayText = Object.entries(potion.ingredients)
    .map(([ingredientName, requiredAmount]) => {
      // Fetch the latest amount from the 'ingredients' object
      const userAmount = ingredients[ingredientName]
        ? ingredients[ingredientName].amount
        : 0;
      return `${ingredientName} ${userAmount}/${requiredAmount}`;
    })
    .join(", ");

  // Update the potion's ingredients display
  potionDisplay.textContent = `Ingredients: ${ingredientsDisplayText}`;
}

function updateAllPotionsDisplay() {
  for (let potionName in potions) {
    updatePotionDisplay(potionName); // Call the existing function to update each potion's display
  }
}

function displayPotions() {
  const potionsContainer = document.getElementById("potions");
  potionsContainer.innerHTML = ""; // Clear existing potion displays

  for (let [potionName, potion] of Object.entries(potions)) {
    // Create the potion item container
    let potionItem = document.createElement("div");
    potionItem.className = "potion-item";
    potionItem.setAttribute("data-potion-name", potionName);

    // Create the potion title
    let potionTitle = document.createElement("div");
    potionTitle.className = "potion-title";
    potionTitle.textContent = potionName;
    potionTitle.addEventListener("click", function () {
      potionDetails.classList.toggle("hidden");
    });

    // Create the potion details container
    let potionDetails = document.createElement("div");
    potionDetails.className = "potion-details hidden";

    // Add the potion effects
    let potionEffects = document.createElement("div");
    potionEffects.className = "potion-effects";
    potionEffects.textContent = "Potion Effects: " + potion.effects;

    // Add the potion ingredients
    let potionIngredients = document.createElement("div");
    potionIngredients.className = "potion-ingredients";
    potionIngredients.textContent =
      "Ingredients: " +
      Object.entries(potion.ingredients)
        .map(
          ([ingredientName, requiredAmount]) =>
            `${ingredientName} ${
              ingredients[ingredientName]?.amount || 0
            }/${requiredAmount}`
        )
        .join(", ");

    // Add the potion DC
    let potionDC = document.createElement("div");
    potionDC.className = "potion-dc";
    potionDC.textContent = "DC: " + potion.dc;

    // Append the potion effects, ingredients, and DC to the details container
    potionDetails.appendChild(potionEffects);
    potionDetails.appendChild(potionIngredients);
    potionDetails.appendChild(potionDC);

    // Recreate the craft button
    let craftButton = document.createElement("button");
    craftButton.className = "craft-btn";
    craftButton.textContent = "Craft";
    craftButton.addEventListener("click", function () {
      craftPotion(potionName);
    });

    // Check if the user has enough ingredients to craft the potion
    let canCraft = true;
    for (let [ingredientName, requiredAmount] of Object.entries(
      potion.ingredients
    )) {
      if (
        !ingredients[ingredientName] ||
        ingredients[ingredientName].amount < requiredAmount
      ) {
        canCraft = false;
        break;
      }
    }

    // Enable or disable the craft button based on ingredient availability
    craftButton.disabled = !canCraft;
    craftButton.style.opacity = canCraft ? "1" : "0.5";

    // Append the craft button to the potion details
    potionDetails.appendChild(craftButton);

    // Append the title and details to the potion item
    potionItem.appendChild(potionTitle);
    potionItem.appendChild(potionDetails);

    // Append the potion item to the potions container
    potionsContainer.appendChild(potionItem);
  }
}

function hideAllForms() {
  document.getElementById("ingredient-input").classList.add("hidden");
  document.getElementById("create-potion-form").classList.add("hidden");
}

function showCreatePotionForm() {
  hideAllForms();
  hideIngredientsList();
  document.getElementById("create-potion-form").classList.remove("hidden");
}

function showPotionsList() {
  hideAllForms();
  hideIngredientsList();
  displayPotions();
}

function showAddIngredientForm() {
  hideAllForms();
  document.getElementById("ingredient-input").classList.remove("hidden");
}

function toggleDropdown() {
  const content = document.getElementById("dropdown-content");

  if (content.style.display === "none" || content.style.display === "") {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}

function showIngredientsList() {
  hideAllForms(); // hide all forms including the add ingredient form
  document.getElementById("ingredients-list").classList.remove("hidden");
  displayIngredients();
}

function hideIngredientsList() {
  document.getElementById("ingredients-list").classList.add("hidden");
}

document
  .getElementById("dropdown-content")
  .addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      // Remove selected class from all buttons
      var buttons = e.target.parentElement.children;
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
      }
      // Add selected class to the clicked button
      e.target.classList.add("selected");

      switch (e.target.id) {
        case "ingredients-list-btn":
          showIngredientsList();
          break;
        case "add-ingredient-btn":
          showAddIngredientForm();
          break;
        case "potions-list-btn":
          showPotionsList();
          break;
        case "add-potion-btn":
          showCreatePotionForm();
          break;
      }
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const potionTitles = document.querySelectorAll(".potion-title");

  potionTitles.forEach((title) => {
    title.addEventListener("click", function () {
      const details = this.nextElementSibling; // The .potion-details element
      details.classList.toggle("hidden");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Load stored ingredients
  const storedIngredients = JSON.parse(
    localStorage.getItem("ingredients") || "{}"
  );
  if (Object.keys(storedIngredients).length > 0) {
    ingredients = storedIngredients;
    displayIngredients();
  }

  // Load stored potions
  const storedPotions = JSON.parse(localStorage.getItem("potions") || "{}");
  if (Object.keys(storedPotions).length > 0) {
    potions = storedPotions;
    displayPotions(); // Ensure ingredients are displayed before potions
  }
});

let ingredients = {};
let potions = {};

function addIngredient() {
  const name = document.getElementById("ingredient-name").value;
  const amount = parseInt(document.getElementById("ingredient-amount").value);

  if (!ingredients[name]) {
    ingredients[name] = amount;
  } else {
    ingredients[name] += amount;
  }

  // Clear the input fields
  document.getElementById("ingredient-name").value = "";
  document.getElementById("ingredient-amount").value = "";

  displayIngredients();
}

function displayIngredients() {
  const list = document.getElementById("ingredients-list");
  list.innerHTML = ""; // Reset the innerHTML

  // Sort ingredients by name
  const sortedIngredients = Object.entries(ingredients).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  for (let [ingredient, amount] of sortedIngredients) {
    list.innerHTML += `<div>${ingredient}: ${amount}</div>`;
  }
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
  };

  for (let pair of ingredientsPairs) {
    const match = pair.match(/(.*\S) (\d+)$/);
    if (match && match.length === 3) {
      const ingredientName = match[1].trim();
      const ingredientAmount = parseInt(match[2]);
      potions[name].ingredients[ingredientName] = ingredientAmount;
    }
  }

  displayPotions();
}

function displayPotions() {
  const list = document.getElementById("potions");
  list.innerHTML = "";

  for (let [potionName, potion] of Object.entries(potions)) {
    list.innerHTML += `<div onclick="showPotionDetails('${potionName}')">${potionName}</div>`;
  }
}

function showPotionDetails(name) {
  const potion = potions[name];
  const details = `<div>
        Effects: ${potion.effects}<br>
        Ingredients: ${JSON.stringify(potion.ingredients)}
    </div>`;
  alert(details);
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

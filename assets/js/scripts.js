let ingredients = {};
let potions = {};

function addIngredient() {
  const name = document.getElementById("ingredient-name").value;
  const amount = parseInt(document.getElementById("ingredient-amount").value);

  if (!ingredients[name]) {
    ingredients[name] = 0;
  }
  ingredients[name] += amount;

  displayIngredients();
}

function displayIngredients() {
  const list = document.getElementById("ingredients-list");
  list.innerHTML = "";

  for (let [ingredient, amount] of Object.entries(ingredients)) {
    list.innerHTML += `<div>${ingredient}: ${amount}</div>`;
  }
}

function addPotion() {
  const name = document.getElementById("potion-name").value;
  const effects = document.getElementById("potion-effects").value;
  const ingredientsInput = document.getElementById("potion-ingredients").value;
  const ingredientsList = ingredientsInput.split(",").map((x) => x.trim());

  potions[name] = {
    effects: effects,
    ingredients: {},
  };

  for (let i = 0; i < ingredientsList.length; i += 2) {
    potions[name].ingredients[ingredientsList[i]] = parseInt(
      ingredientsList[i + 1]
    );
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
  document.getElementById("create-potion-form").classList.remove("hidden");
}

function showPotionsList() {
  hideAllForms();
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

      // Display the appropriate section based on the button clicked
      switch (e.target.id) {
        case "ingredients-list-btn":
          hideAllForms();
          displayIngredients();
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

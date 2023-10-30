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

function showCreatePotionForm() {
  document.getElementById("create-potion-form").classList.remove("hidden");
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

function toggleDropdown() {
  const content = document.getElementById("dropdown-content");
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

function showPotionsList() {
  document.getElementById("create-potion-form").classList.add("hidden");
  displayPotions();
}

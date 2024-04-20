//To switch API Keys, press Ctrl+H and replace the API key with the new one.
//Current API Key = 57c390284c954535a88454a4d30c0966

//========================= SIDENAV BAR ========================= 
console.log("CAH CAW");

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//========================= TOPNAV BAR ========================= 

let prevScrollPos = window.pageYOffset;
const topnav = document.querySelector('.topnav');

window.addEventListener('scroll', () => {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    // Scrolling up
    topnav.classList.remove('hidden');
  } else {
    // Scrolling down
    topnav.classList.add('hidden');
  }
  prevScrollPos = currentScrollPos;
});

//========================= SLIDE SHOW ========================= 

let slideIndex = 0;
let slides = document.getElementsByClassName("mySlides");

// Show the first slide immediately
slides[0].style.display = "block";
slideIndex++;

// Start the timeout for changing slides
setTimeout(showSlides, slideIndex - 1 === 0 ? 0 : 8000);

function showSlides() {
  let i;
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = "block";

  // Set timeout for next slide change
  setTimeout(showSlides, slideIndex - 1 === 0 ? 0 : 8000);
}

//Code to add recipes to slideshow
async function slideshow(recipes) {
  try {
    let result = document.querySelector('.slideshow-container');
    let html = '';

    // Add the first slide outside the loop
    const firstRecipe = recipes[0];
    let firstLine = firstRecipe.summary.split('.')[0];
    html += `
      <div class="mySlides fade">
        <div class="numbertext">1/5</div>
        <img src="${firstRecipe.image}" style="width:100%" onerror="this.src='PlaceholderRand.png'; this.alt='Placeholder Image'">
        <div class="content">
          <h2>${firstRecipe.title}</h2>
          <p>${firstLine}.</p>
          <button class="view-recipe-btn" data-id="${firstRecipe.id}"> View Recipe </button>
        </div>
      </div>  
    `;

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      let firstLine = recipe.summary.split('.')[0]; // Only extract the first line of summary
      html += `
        <div class="mySlides fade">
          <div class="numbertext">${i + 1}/5</div>
          <img src="${recipe.image}" style="width:100%" onerror="this.src='PlaceholderRand.png'; this.alt='Placeholder Image'">
          <div class="content">
            <h2>${recipe.title}</h2>
            <p>${firstLine}.</p>
            <button class="view-recipe-btn" data-id="${recipe.id}"> View Recipe </button>
          </div>
        </div>
      `;
    }

    result.innerHTML = html;

    //========================= RECIPES FOR SLIDE SHOW ========================= 

    // Adding click event listeners to all "View Recipe" buttons in the slideshow
    document.querySelectorAll('.view-recipe-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const recipeId = button.getAttribute('data-id');
        window.location.href = `./Recipes/single-recipe.html?id=${recipeId}`;
      });
    });
  } catch (error) {
    console.error('Error generating slides:', error);
  }
}

async function getPopularData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const recipes = data.recipes;
    await slideshow(recipes);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Update the URL to fetch recipes
const apiKey = '57c390284c954535a88454a4d30c0966';
const apiUrl = `https://api.spoonacular.com/recipes/random?number=5&apiKey=${apiKey}`;
//const apiUrl = 'API tests/RandomTest.json';
getPopularData(apiUrl);

//========================= RANDOM RECIPES ========================= 

//Code to display random recipes
function displayRecipe(recipe) {
  try {
    const recipeContainer = document.querySelector('.recipe-container');
    const summaryWithoutLinks = recipe.summary.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
    const html = `
      <div class="recipe">
        <div class="rand-column">
          <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='PlaceholderRand.png'; this.alt='Placeholder Image'">
        </div>
        <div class="rand-column">
          <h2>${recipe.title}</h2>
          <p>${summaryWithoutLinks}</p>
          <button class="view-recipe-btn" data-id="${recipe.id}"> View Recipe </button>
        </div>
      </div>
    `;
    recipeContainer.innerHTML = html;

    // Adding click event listener to the "View Recipe" button for the random recipe
    const viewRecipeBtn = recipeContainer.querySelector('.view-recipe-btn');
    viewRecipeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const recipeId = viewRecipeBtn.getAttribute('data-id');
      window.location.href = `./Recipes/single-recipe.html?id=${recipeId}`;
    });
  } catch (error) {
    console.error('Error displaying recipe:', error);
  }
}

async function getRandomRecipe(url) {
  const response = await fetch(url);
  const data = await response.json();
  const recipe = data.recipes[0];
  displayRecipe(recipe);
}

document.querySelector('.random-recipe button').addEventListener('click', () => {
  const apiKey = '57c390284c954535a88454a4d30c0966';
  const apiUrl = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`;
  getRandomRecipe(apiUrl);
});

//========================= SEARCH BAR ========================= 

document.getElementById('searchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=57c390284c954535a88454a4d30c0966&query=${query}`;
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
  }
});

//========================= CATEGORY CARDS ========================= 

let categoryRecipesVisible = false;
let currentCategory = ''; // Track the currently displayed category

function handleCategoryClick(type) {
  if (type === currentCategory && categoryRecipesVisible) {
    // If the same category is clicked again and recipes are visible, hide them
    document.querySelector('.category-recipes-container').style.display = 'none';
    categoryRecipesVisible = false;
    currentCategory = '';
  } else {
    // Fetch and display new category recipes
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=57c390284c954535a88454a4d30c0966&type=${type}&number=100`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displayCategoryRecipes(data.results);
        document.querySelector('.category-recipes-container').style.display = 'block';
        categoryRecipesVisible = true;
        currentCategory = type; // Update the current category
      })
      .catch(error => console.error('Error fetching category recipes:', error));
  }
}

//========================= RECIPES FOR CATEGORY CARDS ========================= 

// Function to display category recipes below the categories
function displayCategoryRecipes(recipes) {
  const categoryContainer = document.querySelector('.category-recipes-container');
  let html = '';
  let counter = 0; // Initialize a counter to keep track of cards

  recipes.forEach(recipe => {
    if (counter % 3 === 0) {
      // Start a new recipe row after every 3 cards
      html += '<div class="recipe-row">';
    }

    html += `
      <div class="category-recipe-card">
        <div class="columns">
          <div class="rand-column">
            <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='PlaceholderRand.png'; this.alt='Placeholder Image'">
         
          
            <h2>${recipe.title}</h2><br>
            <button class="view-recipe-btn" data-id="${recipe.id}"> View Recipe </button>
          </div>
        </div>
      </div>
    `;

    if ((counter + 1) % 3 === 0 || counter === recipes.length - 1) {
      // Close the recipe row after every 3 cards or at the end of the recipes
      html += '</div>';
    }

    counter++; // Increment the counter for each card
  });

  categoryContainer.innerHTML = html; // Corrected variable name

  // Adding click event listeners to "View Recipe" buttons
  document.querySelectorAll('.view-recipe-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default button behavior
      const recipeId = button.getAttribute('data-id'); // Get the recipe ID from the button's data attribute
      window.location.href = `./Recipes/single-recipe.html?id=${recipeId}`;
    });
  });
}

// Adding click event listeners to category cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.getAttribute('data-type');
    handleCategoryClick(type);
  });
});

//========================= SINGLE RECIPES ========================= 

// Fetch recipe information from the Spoonacular API
async function fetchRecipeInformation(recipeId) {s
  const apiKey = '57c390284c954535a88454a4d30c0966';
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  localStorage.setItem('currentRecipeId', recipeId);

  if (data.id) {
    displayRecipeInformation(data);
  } else {
    console.error('Invalid recipe ID:', data.id);
  }
}

// Call fetchRecipeInformation when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');

  const storedRecipeId = localStorage.getItem('currentRecipeId');
  if (storedRecipeId && storedRecipeId === recipeId) {
    fetchRecipeInformation(storedRecipeId);
  } else {
    fetchRecipeInformation(recipeId);
  }
});

// Display recipe information on the webpage
function displayRecipeInformation(recipe) {
  try {
    const recipeContainer = document.querySelector('.recipe-details-container');
    const html = `
      <div class="recipe-details">
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='PlaceholderRand.png'; this.alt='Placeholder Image'">
        <h3>Instructions:</h3>
        <p>${recipe.instructions}</p>
      </div>
    `;
    recipeContainer.innerHTML = html;
  } catch (error) {
    console.error('Error displaying recipe information:', error);
  }
}


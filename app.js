'use strict';

// Constructor for product objects
function Product(name, filePath) {
  this.name = name;
  this.filePath = filePath;
  this.timesShown = 0;
  this.timesClicked = 0;
}

// Array to store all product instances
Product.allProducts = [];
Product.lastShown = [];
Product.totalClicks = 0;
Product.rounds = 25;

// Helper function to generate a random index
function getRandomProduct() {
  let index = Math.floor(Math.random() * Product.allProducts.length);
  while (Product.lastShown.includes(index)) {
    index = Math.floor(Math.random() * Product.allProducts.length);
  }
  return index;
}

// Function to display three unique products
function displayProducts() {
  let indices = [];
  while(indices.length < 3) {
    let randomIndex = getRandomIndex();
    if(!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  let productSection = document.getElementById('product-section');
  productSection.innerHTML = '';

  // Increment timesShown and render images
  for (let index of indices) {
    Product.allProducts[index].timesShown++;
    let imgElement = document.createElement('img');
    imgElement.src = Product.allProducts[index].filePath;
    imgElement.alt = Product.allProducts[index].name;
    imgElement.title = Product.allProducts[index].name;
    imgElement.dataset.index = index;
    productSection.appendChild(imgElement);
  }
}

// Event handler for product clicks
function handleProductClick(event) {
  if (Product.totalClicks < Product.rounds) {
    let index = event.target.dataset.index;
    Product.allProducts[index].timesClicked++;
    Product.totalClicks++;
    
    if (Product.totalClicks === Product.rounds) {
      document.getElementById('product-section').removeEventListener('click', handleProductClick);
      showResultsButton();
    } else {
      displayProducts();
    }
  }
}

// Function to show the results button
function showResultsButton() {
  let button = document.createElement('button');
  button.textContent = 'View Results';
  button.addEventListener('click', displayResults);
  document.body.appendChild(button);
}

// Function to display voting results
function displayResults() {
  let resultsList = document.getElementById('results-list');
  resultsList.innerHTML = '';
  
  for (let product of Product.allProducts) {
    let listItem = document.createElement('li');
    listItem.textContent = `${product.name} had ${product.timesClicked} votes, and was seen ${product.timesShown} times.`;
    resultsList.appendChild(listItem);
  }
}

// Instantiate product objects from image paths
function createProducts() {
  let productNames = ['dragon', 'unicorn', 'pet-sweep']; // Add all the product names here
  for (let name of productNames) {
    let filePath = `img/${name}.jpg`; // Adjust if your file path or extensions are different
    Product.allProducts.push(new Product(name, filePath));
  }
}

// Initial setup
function setup() {
  createProducts();
  displayProducts();
  // Attach event listener to the parent section instead of individual images
  let productSection = document.getElementById('product-section');
  productSection.addEventListener('click', function(event) {
    // Check if the click is on an image
    if (event.target.tagName === 'IMG') {
      handleProductClick(event);
    }
  });
}

// Call setup to initialize the app
window.addEventListener('load', setup);

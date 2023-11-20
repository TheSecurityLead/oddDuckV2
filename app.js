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
  let index;
  let counter = 0;
  do {
    index = Math.floor(Math.random() * Product.allProducts.length);
    counter++;
    // If it's taking too long to find a non-duplicate, reset the lastShown array
    if (counter > Product.allProducts.length * 2) {
      Product.lastShown = [];
    }
  } while (Product.lastShown.includes(index));
  return index;
}

// Function to display three unique products
function displayProducts() {
  let indices = [];
  while(indices.length < 3) {
    let randomIndex = getRandomProduct();
    if(!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  Product.lastShown = indices;
  
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

// Function to display chart after voting is complete
function displayChart() {
  let ctx = document.getElementById('results-chart').getContext('2d');
  let productNames = Product.allProducts.map(p => p.name);
  let votes = Product.allProducts.map(p => p.timesClicked);
  let views = Product.allProducts.map(p => p.timesShown);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: 'Votes',
        data: votes,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: 'Views',
        data: views,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Modified showResultsButton function to include chart display
function showResultsButton() {
  let button = document.createElement('button');
  button.textContent = 'View Results';
  button.addEventListener('click', function() {
    displayResults();
    displayChart(); // Call displayChart when results are shown
  });
  document.body.appendChild(button);
}
// Instantiate product objects from image paths
function createProducts() {
  let productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum',
  'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep',
  'tauntaun', 'unicorn', 'water-can', 'wine-glass']; // Add all the product names here
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

function displayResults() {
  let resultsList = document.getElementById('results-list');
  resultsList.innerHTML = ''; // Clear existing results

  for (let product of Product.allProducts) {
    let listItem = document.createElement('li');
    listItem.textContent = `${product.name} had ${product.timesClicked} votes and was seen ${product.timesShown} times.`;
    resultsList.appendChild(listItem);
  }
}

// Call setup to initialize the app
window.addEventListener('load', setup);

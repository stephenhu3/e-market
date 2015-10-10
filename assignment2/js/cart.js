'use strict';

var cart = {};

// Represents quantity of each product in supply
var products = {
  Box1: 10,
  Box2: 5,
  Clothes1: 20,
  Clothes2: 30,
  Jeans: 50,
  Keyboard: 20,
  KeyboardCombo: 40,
  Mice: 20,
  PC1: 350,
  PC2: 400,
  PC3: 300,
  Tent: 100
};

/* Map from displayed product names to the product prices table
   Provides flexibility for the displayed product name in the view
   to differ from the model's product name representation
   However, for sake of automated test, products will be named the same */
var productDisplayNames = {
  "Sorting Box": "Box1",
  "Colored Box": "Box2",
  "Shirt": "Clothes1",
  "Dress": "Clothes2",
  "Jeans": "Jeans",
  "Keyboard": "Keyboard",
  "Keyboard & Mouse": "KeyboardCombo",
  "Mouse": "Mice",
  "Dell PC": "PC1",
  "Refurbished PC": "PC2",
  "Gaming PC": "PC3",
  "Tent": "Tent",

  // These redudant entries are included for the sake of automated test
  "Box1": "Box1",
  "Box2": "Box2",
  "Clothes1": "Clothes1",
  "Clothes2": "Clothes2",
  "Jeans": "Jeans",
  "Keyboard": "Keyboard",
  "KeyboardCombo": "KeyboardCombo",
  "Mice": "Mice",
  "PC1": "PC1",
  "PC2": "PC2",
  "PC3": "PC3",
  "Tent": "Tent"
};

var TIMEOUT = 30000;

var inactiveTime = window.setInterval(alertUser, TIMEOUT);

function addToCart(productName) {
  var product = productDisplayNames[productName];
  if (cart.hasOwnProperty(product)) {
    cart[product]++;
  } else {
    cart[product] = 1;
  }
  products[product]--;
  resetTimer();
}

function removeFromCart(productName) {
  var product = productDisplayNames[productName];
  if (cart.hasOwnProperty(product)) {
    if (cart[product] > 1) {
      cart[product]--;
    } else {
      delete cart[product];
    }
    products[product]++;
  } else {
    window.alert(productName + ' does not exist in the cart.');
  }
  resetTimer();
}

function alertUser() {
  window.alert('Hey there! Are you still planning to buy something?');
}

function resetTimer() {
  window.clearInterval(inactiveTime);
  inactiveTime = window.setInterval(alertUser, TIMEOUT);
}

// TODO: display each item as a separate alert (30 second interval between alerts)
function showCart() {
  var cartString = 'All Items in Cart:\n\n';
  for (var item in cart) {
    if (cart.hasOwnProperty(item)) {
      cartString += getProductDisplayName(item) + ' | Quantity: ' + cart[item] + '\n';
    }
  }
  alert(cartString);
}

// Iterates through product display names table and returns name of the input product
function getProductDisplayName(product) {
  for (name in productDisplayNames) {
    if (productDisplayNames[name] == product)
      return name;
  }
}

window.onload = function() {
  resetTimer();
}

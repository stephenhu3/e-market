'use strict';

var cart = {};

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

// Map from displayed product names to the product prices table
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
  "Tent": "Tent"
};

var TIMEOUT = 30000;

// var inactiveTime = window.setInterval(alertUser, TIMEOUT);

function addToCart(productName) {
  var product = productDisplayNames[productName];
  if (cart.hasOwnProperty(product)) {
    cart[product]++;
  } else {
    cart[product] = 1;
  }
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

function showCart() {
  var cartString = 'Cart:\n\n';
  for (var item in cart) {
    if (cart.hasOwnProperty(item)) {
      cartString += getProductDisplayName(item) + ': ' + cart[item] + ' in cart' + '\n';
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

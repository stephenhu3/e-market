'use strict';

var cart = {};

// Represents quantity of each product in supply
var products = {
  Box1: 10,
  Box2: 10,
  Clothes1: 10,
  Clothes2: 10,
  Jeans: 10,
  Keyboard: 10,
  KeyboardCombo: 10,
  Mice: 10,
  PC1: 10,
  PC2: 10,
  PC3: 10,
  Tent: 10
};

/* Map from displayed product names to the product prices table
   Provides flexibility for the displayed product name in the view
   to differ from the model's product name representation
   However, for sake of automated test, products will be named the same */
var productDisplayNames = {
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
  "Tent": "Tent",

  // These are the desired displayed name
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

function showCart() {
  var iter = 0;
  var cartAlerts=[];
  for (var item in cart) {
    if (cart.hasOwnProperty(item)) {
      var cartString = 'Items in Cart:\n' + getProductDisplayName(item) + ' | Quantity: ' + cart[item] + '\n';
      // After first alert, each following product will be alerted in 30 second intervals
      cartAlerts.push(cartString);
      setTimeout(function(index){alert(cartAlerts[index])}, (iter) * TIMEOUT, iter);
      iter++;
    }
    else
      alert("Cart is empty.");
  }
  resetTimer();
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

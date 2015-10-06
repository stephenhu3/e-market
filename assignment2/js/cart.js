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

var TIMEOUT = 30000;

var inactiveTime = window.setInterval(alertUser, TIMEOUT);

function addToCart(productName) {
  if (cart.hasOwnProperty(productName)) {
    cart[productName]++;
  } else {
    cart[productName] = 1;
  }
  resetTimer();
}

function removeFromCart(productName) {
  if (cart.hasOwnProperty(productName)) {
    if (cart[productName] > 1) {
      cart[productName]--;
    } else {
      delete cart[productName];
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
      cartString += item + ': ' + cart[item] + ' in cart' + '\n';
    }
  }
  alert(cartString);
}

window.onload = function() {
  resetTimer();
}

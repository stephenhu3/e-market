'use strict';

var cart = {};

var products = {
  _Box1: 10,
  _Box2: 5,
  _Clothes1: 20,
  _Clothes2: 30,
  _Jeans: 50,
  _Keyboard: 20,
  _KeyboardCombo: 40,
  _Mice: 20,
  _PC1: 350,
  _PC2: 400,
  _PC3: 300,
  _Tent: 100
};

var TIMEOUT = 30000;

var inactiveTime = window.setTimeout(alertUser(), TIMEOUT);

function addToCart(productName) {
  if (cart.hasOwnProperty(productName)) {
    cart.productName++;
  } else {
    cart.productName = 1;
  }
}

function removeFromCart(productName) {
  if (cart.hasOwnProperty(productName) {
    if (cart.productName > 1) {
      cart.productName--;
    } else {
      delete cart.productName;
    }
  } else {
    alert(productName + " does not exist in the cart.");
  }
}

function alertUser() {
  alert('Hey there! Are you still planning to buy something?');
  inactiveTime = window.setTimeout(alertUser(), TIMEOUT);
}

function resetTimer() {
  inactiveTime = window.setTimeout(alertUser(), TIMEOUT);
}

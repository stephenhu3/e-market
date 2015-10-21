'use strict';

var cart = {};

// Represents price and quantity of each product in supply
var products = {
  Box1: {
    price: 10,
    quantity: 10
  },
  Box2: {
    price: 5,
    quantity: 10
  },
  Clothes1: {
    price: 20,
    quantity: 10
  },
  Clothes2: {
    price: 30,
    quantity: 10
  },
  Jeans: {
    price: 50,
    quantity: 10
  },
  Keyboard: {
    price: 20,
    quantity: 10
  },
  KeyboardCombo: {
    price: 40,
    quantity: 10
  },
  Mice: {
    price: 20,
    quantity: 10
  },
  PC1: {
    price: 350,
    quantity: 10
  },
  PC2: {
    price: 400,
    quantity: 10
  },
  PC3: {
    price: 300,
    quantity: 10
  },
  Tent: {
    price: 100,
    quantity: 10
  }
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
  products[product].quantity--;
  resetTimer();
  updateCartDisplay();
}

function removeFromCart(productName) {
  var product = productDisplayNames[productName];
  if (cart.hasOwnProperty(product)) {
    if (cart[product] > 1) {
      cart[product]--;
    } else {
      delete cart[product];
    }
    products[product].quantity++;
  } else {
    window.alert(productName + ' does not exist in the cart.');
  }
  resetTimer();
  updateCartDisplay();
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

// Iterates through cart and calculates total price
function getTotalPrice() {
  var totalPrice = 0;
  for (var item in cart) {
    if (cart.hasOwnProperty(item)) {
      var productPrice = getProductPrice(item);
      if (productPrice != -1)
        // Quantity purchased multiplied by the product price
        totalPrice += cart[item] * productPrice;      
      else
        continue;
    }
  }
  return totalPrice;
}

// Return the price of a product, and -1 if not found
function getProductPrice(product) {
  if (products.hasOwnProperty(product))
    return products[product].price;
  else
    return -1;
}

// Update the displayed cart total price
function updateCartDisplay() {
  document.getElementById("cart-btn").innerHTML = "Cart: ($" + getTotalPrice() + ')';
}

// On load, start the timer and display the cart total price
window.onload = function() {
  resetTimer();
  updateCartDisplay();
}

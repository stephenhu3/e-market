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
   to differ from the model's product name representation */
var productDisplayNames = {
  // These are the desired displayed name
  "Sorting Box": "Box1",
  "Colored Box": "Box2",
  "Dress": "Clothes1",
  "Shirt": "Clothes2",
  "Jeans": "Jeans",
  "Keyboard": "Keyboard",
  "Keyboard &amp; Mouse": "KeyboardCombo",
  "Mouse": "Mice",
  "Dell PC": "PC1",
  "Refurbished PC": "PC2",
  "Gaming PC": "PC3",
  "Tent": "Tent",
  // Convert an internal product name to its displayed name.
  // Returns the first display name that is found to be
  // associated with internalName.
  toDisplayName: function(internalName) {
    for (var key in productDisplayNames) {
      if (internalName === productDisplayNames[key]) {
        return key;
      }
    }
  }
};

// 300000 ms = 5 minutes
var TIMEOUT = 300000;

// Represents inactivity time in seconds
var inactiveTime = 0;

// Tick inactivity every second
window.setInterval(tickInactivity, 1000);

// Pass in the display name of the product
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

// Pass in the display name of the product
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

function tickInactivity() {
  inactiveTime++;
  // If timeout threshold has been reached
  if (inactiveTime * 1000 >= TIMEOUT) {
    alertUser();
    resetTimer();
  }
  updateInactivityDisplay()
}

function alertUser() {
  window.alert('Hey there! Are you still planning to buy something?');
}

function resetTimer() {
  inactiveTime = 0;
  updateInactivityDisplay()
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

// Return the inactivity time elapsed in seconds
function getInactivityTime() {
  return inactiveTime;
}

// Update the displayed cart total price
function updateCartDisplay() {
  document.getElementById("cart-btn").innerHTML = "Cart: ($" + getTotalPrice() + ')';
}

// Update footer display of elapsed inactivity time
function updateInactivityDisplay() {
  var timeElapsed = getInactivityTime();
  var inactivityMessage;
  if (timeElapsed < 2)
    inactivityMessage = "You have not shopped for " + timeElapsed + " second. Hurry while supplies last!";
  else
    inactivityMessage = "You have not shopped for " + timeElapsed + " seconds. Hurry while supplies last!";
  document.getElementById("inactivity-counter").innerHTML = inactivityMessage;
}

// On load, start the timer and display the cart total price
window.onload = function() {
  resetTimer();
  updateCartDisplay();
}

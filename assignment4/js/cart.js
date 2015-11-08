'use strict';

var cart = {};

// Represents price and quantity of each product in supply
// Updated using an AJAX call to the server
var product = {};

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
  var rawProduct = productDisplayNames[productName];
  if (product[rawProduct] !== undefined) {
    if (cart.hasOwnProperty(rawProduct)) {
      cart[rawProduct]++;
    } else {
      cart[rawProduct] = 1;
    }
    product[rawProduct].quantity--;
    resetTimer();
    updateCartDisplay();
  }
}

// Pass in the display name of the product
function removeFromCart(productName) {
  var rawProduct = productDisplayNames[productName];
  if (product[rawProduct] !== undefined) {
      if (cart.hasOwnProperty(rawProduct)) {
        if (cart[rawProduct] > 1) {
          cart[rawProduct]--;
        } else {
          delete cart[rawProduct];
        }
        product[rawProduct].quantity++;
      } else {
        window.alert(productName + ' does not exist in the cart.');
      }
      resetTimer();
      updateCartDisplay();
  }
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
function getProductDisplayName(prod) {
  for (name in productDisplayNames) {
    if (productDisplayNames[name] == prod)
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
function getProductPrice(prod) {
  if (product.hasOwnProperty(prod))
    return product[prod].price;
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

function attemptRequest(prod) {
  var tries = 1;
  var MAX_TRIES = 1;
    (function doRequest() {
      var x = new XMLHttpRequest();
      var url = "https://cpen400a.herokuapp.com/products";
      x.open("GET", url);
      var loader = function() {
        if (x.status === 200) {
          console.log("Request success");
          var responseText = x.responseText;
          var response = null;
          if (x.getResponseHeader("Content-type") ===
              "application/json; charset=utf-8") {
            try {
              response = JSON.parse(responseText);
            } catch (e) {
              response = null;
              console.warn("Could not parse JSON from " + url);
            }
          }
          updateProduct(response);
          tries = 1;  // reset tries
        } else {
          console.error("Request contained status code: " + x.status);
          if (tries < MAX_TRIES) {
            tries++;
            doRequest();
          } else {
            console.warn("Maximum request attempts reached")
          }
        }
      }
      // update product with obj's price and quantity properties
      function updateProduct(obj) {
        if (obj) {
          var price;
          var quantity;
          for (var key in obj) {
            if (obj.hasOwnProperty(key) &&
                "price" in obj[key] &&
                  obj[key].hasOwnProperty("price")) {
              price = obj[key]["price"];
            }
            if (obj.hasOwnProperty(key) &&
                "quantity" in obj[key] &&
                  obj[key].hasOwnProperty("quantity")) {
              quantity = obj[key]["quantity"];
            }
            if (price !== undefined && quantity !== undefined) {
              prod[key] = {
                'price': price,
                'quantity': quantity
              };
            }
          }
        }
      }
      x.onload = function() {
        loader();
      };
      x.onabort = function() {
        console.error("Request aborted");
      };
      x.timeout = 500;
      x.ontimeout = function() {
        console.error("Request timed out");
        loader();
      };
      x.onerror = function() {
        console.error("Request contained an error with status code: " + x.status);
        loader();
      };
      x.send();
  })();
}

// On load, start the timer and display the cart total price
window.onload = function() {
  attemptRequest(product);
  resetTimer();
  updateCartDisplay();
}

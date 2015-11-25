'use strict';

var cart = {};

// Represents price, quantity and image URL of each product in supply
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
    document.getElementById("cart-btn").innerHTML = "Cart: ($" + getTotalPrice() +
        ')';
}

// Update footer display of elapsed inactivity time
function updateInactivityDisplay() {
    var timeElapsed = getInactivityTime();
    var inactivityMessage;
    if (timeElapsed < 2)
        inactivityMessage = "You have not shopped for " + timeElapsed +
        " second. Hurry while supplies last!";
    else
        inactivityMessage = "You have not shopped for " + timeElapsed +
        " seconds. Hurry while supplies last!";
    document.getElementById("inactivity-counter").innerHTML = inactivityMessage;
}

function attemptProductsGETRequest(prod) {
    return new Promise(function(resolve, reject) {
        var tries = 1;
        var MAX_TRIES = 5;
        (function doRequest() {
            var x = new XMLHttpRequest();
            var url = "http://localhost:8080/products";
            x.open("GET", url);
            var loader = function() {
                if (x.status === 200) {
                    console.log("Request success");
                    var responseText = x.responseText;
                    var response = null;
                    response = JSON.parse(responseText);
                    if (x.getResponseHeader("Content-type") ===
                        "application/json; charset=utf-8") {
                        try {
                            response = JSON.parse(responseText);
                        } catch (e) {
                            response = null;
                            console.warn(
                                "Could not parse JSON from " +
                                url);
                        }
                    }
                    tries = 1; // reset tries
                    updateProduct(response);
                } else {
                    console.error(
                        "Request contained status code: " +
                        x.status);
                    if (tries < MAX_TRIES) {
                        tries++;
                        doRequest();
                    } else {
                        console.warn(
                            "Maximum request attempts reached"
                        );
                        reject(
                            "Maximum request attempts reached"
                        );
                    }
                }
            }
            // update product with obj's price and quantity properties
            function updateProduct(obj) {
                if (obj) {
                    var price;
                    var quantity;
                    var imageUrl;
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
                        if (obj.hasOwnProperty(key) &&
                            "url" in obj[key] &&
                            obj[key].hasOwnProperty("url")) {
                            url = obj[key]["url"];
                        }
                        if (price !== undefined && quantity !==
                            undefined) {
                            prod[key] = {
                                'price': price,
                                'quantity': quantity,
                                'url': url
                            };
                        }
                    }
                    // Resolve promise object
                    resolve("Products successfully updated");
                }
            }
            x.onload = function() {
                loader();
                updateProductImages();
            };
            x.onabort = function() {
                console.error("Request aborted");
            };
            x.timeout = 1000;
            x.ontimeout = function() {
                console.error("Request timed out");
                loader();
            };
            x.onerror = function() {
                console.error(
                    "Request contained an error with status code: " +
                    x.status);
                loader();
            };
            x.send();
        })();
    });
}

function attemptOrderPOSTRequest() {
    return new Promise(function(resolve, reject) {
        var tries = 1;
        var MAX_TRIES = 5;
        (function doRequest() {
            var x = new XMLHttpRequest();
            var url = "http://localhost:8080/orders";
            x.open("POST", url);
            var loader = function() {
                if (x.status === 200) {
                    console.log("Request success");
                    tries = 1; // reset tries
                } else {
                    console.error(
                        "Request contained status code: " +
                        x.status);
                    if (tries < MAX_TRIES) {
                        tries++;
                        doRequest();
                    } else {
                        console.warn(
                            "Maximum request attempts reached"
                        );
                        reject(
                            "Maximum request attempts reached"
                        );
                    }
                }
            }
            x.onabort = function() {
                console.error("Request aborted");
            };
            x.timeout = 1000;
            x.ontimeout = function() {
                console.error("Request timed out");
                loader();
            };
            x.onerror = function() {
                console.error(
                    "Request contained an error with status code: " +
                    x.status);
                loader();
            };
            x.setRequestHeader('Content-Type', 'application/json');
            var retObj = {
                cart: JSON.stringify(cart),
                total: getTotalPrice()
            };
            x.send(JSON.stringify(retObj));
        })();
    });
}

// Update product thumbnail images using the product variable
function updateProductImages() {
    // Show product images if available
    if (Object.keys(product).length > 0) {
        var children = $(this).children("h3.product-name");
        var displayName = children.html();
        var internalName = productDisplayNames[displayName];
        // Update displayed images on product thumbnails
        for (var key in product) {
            if (product.hasOwnProperty(key) &&
                typeof product[key]["url"] === "string") {
                var foundProducts = $(".product-name");
                var foundProduct = foundProducts.filter(
                    function(index) {
                        return foundProducts[index].innerHTML ===
                            productDisplayNames.toDisplayName(
                                key);
                });
                foundProduct.siblings(".box")
                    .css("background", "11px 0px/225px 225px url(" +
                            product[key]["url"] +
                            ") no-repeat");
            }
        }
    }
}

function checkoutCart() {
    // check cart's contents (prices and quantity)
    // make GET request for latest prices/quantity
    // update cart contents prices and alert to user the updated prices
    // update cart quantities (remove if 0, reduce if existing stock less than requested)
    return new Promise(function(resolve, reject) {
        var oldCart = [];
        for (var item in cart) {
            if (product.hasOwnProperty(item)) {
                var oldItem = {
                    'name': productDisplayNames.toDisplayName(item),
                    'price': product[item].price,
                    'quantity': product[item].quantity
                }
                oldCart.push(oldItem);
            }
        }
        console.log("old cart");
        console.log(oldCart);
        attemptProductsGETRequest(product).then(
                // resolved promise
                function(val) {
                    updateCart();
                })
            .catch(
                // rejected promise
                function(reason) {
                    alert("Checkout was unavailable. Please try again.");
                    console.log('Handle rejected promise (' + reason +
                        ') here.');
                    reject(reason);
                });
        if (Object.keys(cart).length > 0) {
            attemptOrderPOSTRequest().then(
                    // resolved promise
                    function(val) {
                        updateCart();
                    })
                .catch(
                    // rejected promise
                    function(reason) {
                        alert("Checkout was unavailable. Please try again.");
                        console.log('Handle rejected promise (' + reason +
                            ') here.');
                        reject(reason);
                    });
        } else {
            alert("Please add some items into your cart before checking out.");
        }
        function updateCart() {
            var cartUpdates = "";
            for (var i = 0; i < oldCart.length; i++) {
                var updateItem = product[productDisplayNames[oldCart[i]
                    .name]];
                var oldItem = oldCart[i];
                if (updateItem &&
                    updateItem.hasOwnProperty("price") &&
                    updateItem.hasOwnProperty("quantity")) {
                    if (updateItem.quantity === 0) {
                        // remove item from cart
                        delete cart[productDisplayNames[oldItem.name]];
                        cartUpdates += oldItem.name +
                            ": Out of stock for this item. It has been removed from your cart.\n";
                        break;
                    } else if (oldItem.quantity > updateItem.quantity) {
                        // update cart quantity for item
                        var oldCartQuantity = cart[productDisplayNames[
                            oldItem.name]];
                        cart[productDisplayNames[oldItem.name]] =
                            updateItem.quantity;
                        cartUpdates += oldItem.name +
                            ": Item stock low. Your quantity has changed from " +
                            oldCartQuantity + " to " + updateItem.quantity +
                            ".\n";
                    }
                    if (oldItem.price != updateItem.price) {
                        cartUpdates += oldItem.name +
                            ": Item price has changed from $" + oldItem
                            .price + " to $" + updateItem.price + ".\n";
                    }
                }
            }
            cartUpdates.length > 0 ? alert(cartUpdates) : null;
            resolve("Cart has successfully updated");
        }
    })
};


// On load, start the timer and display the cart total price
window.onload = function() {
    attemptProductsGETRequest(product);
    resetTimer();
    updateCartDisplay();
}

'use strict';

$(document).ready(function() {
	$(".add-cart").click(function() {
		if (Object.keys(product).length > 0) {
			var productName = $(this).parents(".box").siblings(".product-name").html();
			addToCart(productName);
			$(this).siblings(".remove-cart").show();
			updateCartModal();
		}
	});

	$(".remove-cart").click(function() {
		if (Object.keys(product).length > 0) {
			var displayName = $(this).parents(".box").siblings(".product-name").html();
			var internalName = productDisplayNames[displayName];
			if (internalName in cart) {
				removeFromCart(displayName);
			}
			if (!(internalName in cart)) {
				$(this).hide();
			}
			updateCartModal();
		}
	});

	$(".show-cart").click(function() {
		$(".cart-modal").fadeIn();
		updateCartModal();
	});

	$(".close-cart-modal").click(function() {
		$(".cart-modal").fadeOut();
		updateCartModal();
	})

	$(document).keyup(function(e) {
		// If escape key pressed, close the modal
		if (e.keyCode == 27)
			$(".cart-modal").fadeOut();
	});

	$(".thumbnail").hover(function() {
		// Don't show add and remove button if product object is empty
		if (!(Object.keys(product).length > 0)) {
			$(this).find(".add-cart").hide();
			$(this).find(".remove-cart").hide();
		} else {
			var children = $(this).children("h3.product-name");
			var displayName = children.html();
			var internalName = productDisplayNames[displayName];
			$(this).find(".add-cart").show();
			// Ensure that only one product name was found
			if (children.length === 1 &&
				 internalName in cart &&
				  cart[internalName] > 0) {
					$(this).find(".remove-cart").show();
			} else {
				$(this).find(".remove-cart").hide();
			}
			// Update displayed prices on product thumbnails
			for (var key in product) {
				if (product.hasOwnProperty(key) &&
						typeof product[key]["price"] === "number") {
					var foundProducts = $(".product-name");
					var $foundProduct = foundProducts.filter(function(index) {
						return foundProducts[index].innerHTML ===
						 		productDisplayNames.toDisplayName(key);
					});
					$foundProduct.siblings(".overlay")
							.children("h4").html("$" + product[key]["price"])
				}
			}
		}
	});

	$("body").on("click", ".add-quantity", function() {
		// get id of this
		var idString = $(this).attr("id");
		if (/cart-modal-quantity-row-\d+/.test(idString)) {
			// get the row position of the product to modify
			var splitId = idString.split("-");
			var relativeIndex = splitId[splitId.length - 1];
			// update quantity of the product corresponding to the index
			var productName = $(".cart-product-name").children("h5#cart-modal-name-row-" + relativeIndex).html();
			addToCart(productName);
			updateCartModal();
		}
	})

	$("body").on("click", ".remove-quantity", function() {
		// get id of this
		var idString = $(this).attr("id");
		if (/cart-modal-quantity-row-\d+/.test(idString)) {
			// get the row position of the product to modify
			var splitId = idString.split("-");
			var relativeIndex = splitId[splitId.length - 1];
			// update quantity of the product corresponding to the index
			var productName = $(".cart-product-name").children("h5#cart-modal-name-row-" + relativeIndex).html();
			var internalName = productDisplayNames[productName];
			if (internalName in cart) {
				removeFromCart(productName);
			}
			updateCartModal();
		}
	})

	// hide modal at startup
	$(".cart-modal").hide();

	// set cart at startup
	updateCartModal();
});

// update cart modal view
function updateCartModal() {
	// get list of items in the cart
	var cartItemList = Object.keys(cart);
	// update names
	var namesHtml = "";
	for (var i = 0; i < cartItemList.length; i++) {
		namesHtml += "<h5 id=\"cart-modal-name-row-" + i + "\">" +
				productDisplayNames.toDisplayName(cartItemList[i]) + "</h5>";
	}
	$(".cart-product-name").html(namesHtml);
	// update prices
	var pricesHtml = "";
	for (var i = 0; i < cartItemList.length; i++) {
		if (product[cartItemList[i]] !== undefined) {
			pricesHtml += "<h5>$" + product[cartItemList[i]].price + "</h5>";
		}
	}
	$(".cart-product-price").html(pricesHtml);
	// update quantities
	var quantitiesHtml = "";
	for (var i = 0; i < cartItemList.length; i++) {
			quantitiesHtml += "<div><h5 class=\"in-cart-quantity\">" + cart[cartItemList[i]] + "</h5>" +
			"<button class=\"add-quantity\" + id=\"cart-modal-quantity-row-" + i +
			"\">+</button>" +
			"<button class=\"remove-quantity\" id=\"cart-modal-quantity-row-" + i +
			"\">-</button></div>";
	}
	$(".cart-product-quantity").html(quantitiesHtml);

	// shift accordingly to keep add/remove buttons vertically aligned as number of digits in quantity changes
	$(".in-cart-quantity").each(function() {
		$(this).css("margin-left", this.innerHTML.toString().length * -8);
	});

	// update subtotal prices
	var subtotalsHtml = "";
	for (var i = 0; i < cartItemList.length; i++) {
		if (product[cartItemList[i]] !== undefined) {
			subtotalsHtml += "<h5>$" +
				cart[cartItemList[i]] * product[cartItemList[i]].price + "</h5>";
		}
	}
	$(".cart-product-subtotal").html(subtotalsHtml);
	// update total price
	var totalPrice = 0;
	for (var i = 0; i < cartItemList.length; i++) {
		if (product[cartItemList[i]] !== undefined) {
			totalPrice += cart[cartItemList[i]] * product[cartItemList[i]].price;
		}
	}

	var $cartTotal = $("#cart-total");
	// remain right-justified as number of digits change
	$cartTotal.css("margin-left", 33 - totalPrice.toString().length * 10);
	$cartTotal.html("<h4 id=\"cart-total\">Total:&nbsp;&nbsp;$" +
			totalPrice + "</h4>");
}

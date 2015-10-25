'use strict';

$(document).ready(function() {
	$(".add-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		addToCart(productName);
		$(this).siblings(".remove-cart").show();
		updateCartModal();
	});

	$(".remove-cart").click(function() {
		var displayName = $(this).parents(".box").siblings(".product-name").html();
		var internalName = productDisplayNames[displayName];
		if (internalName in cart) {
			removeFromCart(displayName);
		}
		if (!(internalName in cart)) {
			$(this).hide();
		}
		updateCartModal();
	});

	$(".show-cart").click(function() {
		$(".cart-modal").fadeIn();
		updateCartModal();
	});

	$(".close-cart-modal").click(function() {
		$(".cart-modal").fadeOut();
		updateCartModal();
	})

	$(".thumbnail").hover(function() {
		var children = $(this).children("h3.product-name");
		var displayName = children.html();
		var internalName = productDisplayNames[displayName];
		// Ensure that only one product name was found
		if (children.length === 1 &&
			 internalName in cart &&
			  cart[internalName] > 0) {
				$(this).find(".remove-cart").show();
		} else {
			$(this).find(".remove-cart").hide();
		}
	});

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
		namesHtml += "<h5>" + productDisplayNames.toDisplayName(cartItemList[i]) + "</h5>";
	}
	$(".cart-product-name > h5").html(namesHtml);
	// update prices
	var pricesHtml = "";
	for (var i = 0; i < cartItemList.length; i++) {
		pricesHtml += "<h5>$" + products[cartItemList[i]].price + "</h5>";
	}
	$(".cart-product-price > h5").html(pricesHtml);
}

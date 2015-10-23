'use strict';

$(document).ready(function() {
	$(".add-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		addToCart(productName);
		$(this).siblings(".remove-cart").show();
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
	});

	// TODO: refactor for new cart modal
	// $(".show-cart").click(function() {
	// 	showCart();
	// });

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
});

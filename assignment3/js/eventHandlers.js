'use strict';

$(document).ready(function() {
	$(".add-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		addToCart(productName);
		$(this).siblings(".remove-cart").show();
	});

	$(".remove-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		if (productName in cart) {
			removeFromCart(productName);
		}
		if (!(productName in cart)) {
			$(this).hide();
		}
	});

	// TODO: refactor for new cart modal
	// $(".show-cart").click(function() {
	// 	showCart();
	// });

	$(".thumbnail").hover(function() {
		var children = $(this).children("h3.product-name");
		// Ensure that only one product name was found
		if (children.length === 1 &&
			 children.html() in cart &&
			  cart[children.html()] > 0) {
				$(this).find(".remove-cart").show();
		} else {
			$(this).find(".remove-cart").hide();
		}
	});
});

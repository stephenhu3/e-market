'use strict';

$(document).ready(function() {
	$(".add-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		addToCart(productName);
		$(".remove-cart").show();
	});

	$(".remove-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		removeFromCart(productName);
		if (jQuery.isEmptyObject(cart)) {
			$(".remove-cart").hide();
		}
	});

	$(".show-cart").click(function() {
		showCart();
	});

	$(".box").hover(function() {
		if (jQuery.isEmptyObject(cart)) {
			$(".remove-cart").hide();
		} else {
			$(".remove-cart").show();
		}
	});
});

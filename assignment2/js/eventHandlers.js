$(document).ready(function() {
	$(".add-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		addToCart(productName);
	});

	$(".remove-cart").click(function() {
		var productName = $(this).parents(".box").siblings(".product-name").html();
		removeFromCart(productName);
	});
});
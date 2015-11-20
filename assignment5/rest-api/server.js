// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var uriUtil    = require('mongodb-uri');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fill in credentials
var DBUSER = process.env.MONGOLAB_USER;
var DBPASS = process.env.MONGOLAB_PASS;

var mongoose = require('mongoose');
// connect to hosted mongolab db
var mongodbUri = 'mongodb://' + DBUSER + ':' + DBPASS + '@ds051524.mongolab.com:51524/group9';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var mongooseLocalUri = 'mongodb://localhost/rest_api'; // connect to local db

mongoose.connect(mongooseLocalUri, function (error) {
    if (error) {
        console.log('Failed to connect to server:\n' + error);
    }
});


var Product = require('./app/models/product');
var Order = require('./app/models/order');

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Request was made');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/api', function(req, res) {
    res.json({ message: 'You are using BuySmart REST API' });   
});

// on routes that end in /products
// ----------------------------------------------------
router.route('/products')

    // create a product (accessed at POST http://localhost:8080/api/products)
    .post(function(req, res) {
        var product = new Product(); // create a new instance of the Product model
        product.name = req.body.name; 
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.url = req.body.url;

        // save the product and check for errors
        product.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Product successfully created' });
        });
        
    })

    // get all the products (accessed at GET http://localhost:8080/products)
    .get(function(req, res) {
        Product.find(function(err, products) {
            if (err)
                res.send(err);

            var productResponse = "{";

            for (product in products) {
                if (product == products.length - 1) {
                    productResponse += 
                    '"' + products[product].name + '"' + ':{"price":' + products[product].price + ',"quantity":'
                    + products[product].quantity + ',"url":"'
                    + products[product].url + '"' + "}";
                } else {
                    productResponse += 
                    '"' + products[product].name + '"' + ':{"price":' + products[product].price + ',"quantity":'
                    + products[product].quantity + ',"url":"'
                    + products[product].url + '"' + "},";
                }
            }

            productResponse += "}";
            res.set('Content-Type', 'text/json');
            res.send(productResponse);
        });
    });

router.route('/products/:product_id')

    // get the product with that id (accessed at GET http://localhost:8080/products/:product_id)
    .get(function(req, res) {
        Product.findById(req.params.product_id, function(err, product) {
            if (err)
                res.send(err);
            res.json(product);
        });
    })

    // update the product with this id (accessed at PUT http://localhost:8080/products/:product_id)
    .put(function(req, res) {
        // use our product model to find the product we want
        Product.findById(req.params.product_id, function(err, product) {
            if (err)
                res.send(err);
          
            // set attributes if they're defined in the PUT request
            product.name = req.body.name ? req.body.name : product.name;
            product.price = req.body.price ? req.body.price : product.price;
            product.quantity = req.body.quantity ? req.body.quantity : product.quantity;
            product.url = req.body.url ? req.body.url : product.url;

            // save the product
            product.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Product successfully updated' });
            });

        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/products/:product_id)
    .delete(function(req, res) {
        Product.remove({
            _id: req.params.product_id
        }, function(err, product) {
            if (err)
                res.send(err);
            res.json({ message: 'Product successfully deleted' });
        });
    });

// on routes that end in /orders
// ----------------------------------------------------
router.route('/orders')

    // create a order (accessed at POST http://localhost:8080/orders)
    .post(function(req, res) {
        var order = new Order();      // create a new instance of the Order model
        order.cart = req.body.cart;
        order.total = req.body.total;

        // save the order and check for errors
        order.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Order successfully created' });
        });
        
    })

    // get all the orders (accessed at GET http://localhost:8080/orders)
    .get(function(req, res) {
        Order.find(function(err, orders) {
            if (err)
                res.send(err);
            res.json(orders);
        });
    });

router.route('/orders/:order_id')

    // get the order with that id (accessed at GET http://localhost:8080/orders/:order_id)
    .get(function(req, res) {
        Order.findById(req.params.order_id, function(err, order) {
            if (err)
                res.send(err);
            res.json(order);
        });
    })

    // update the order with this id (accessed at PUT http://localhost:8080/orders/:order_id)
    .put(function(req, res) {
        // use our order model to find the order we want
        Order.findById(req.params.order_id, function(err, order) {
            if (err)
                res.send(err);

            // set attributes if they're defined in the PUT request
		    order.cart = req.body.cart ? req.body.cart : order.cart;
	        order.total = req.body.total ? req.body.total : order.total;

            // save the order
            order.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Order successfully updated' });
            });

        });
    })

    // delete the order with this id (accessed at DELETE http://localhost:8080/orders/:order_id)
    .delete(function(req, res) {
        Order.remove({
            _id: req.params.order_id
        }, function(err, order) {
            if (err)
                res.send(err);
            res.json({ message: 'Order successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
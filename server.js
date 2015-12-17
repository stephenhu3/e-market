// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var uriUtil = require('mongodb-uri');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://stephenhu.me');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Fill in credentials
var DBUSER = process.env.MONGOLAB_USER;
var DBPASS = process.env.MONGOLAB_PASS;

var mongoose = require('mongoose');
// connect to hosted mongolab db
var mongodbUri = 'mongodb://' + DBUSER + ':' + DBPASS +
    '@ds033175.mongolab.com:33175/e-market';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var mongooseLocalUri = 'mongodb://localhost/rest_api'; // connect to local db

mongoose.connect(mongooseUri, function(error) {
    if (error) {
        console.log('Failed to connect to server:\n' + error);
    }
});


var Product = require('./app/models/product');

function decrementProductStock(name, decrement) {
    var reduceStock = -decrement;
    var conditions = {
        name: name
    };
    var update = {
        $inc: {
            quantity: reduceStock
        }
    };
    var options = {
        multi: true
    };

    Product.update(conditions, update, options, callback);

    function callback(err, numAffected) {
        // numAffected.nModified is the number of updated documents
        return numAffected.nModified;
    }
}


var Order = require('./app/models/order');
var User = require('./app/models/user');

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

// test default route to make sure everything is working (accessed at GET http://localhost:8080/)
router.get('/', function(req, res) {
    res.json({
        message: 'You are using BuySmart REST API'
    });
});

// on routes that end in /products
// ----------------------------------------------------
router.route('/products')

// [Basic Authentication Required]
// update the quantity of each product based on the cart JSON in the body of the request
// (accessed at POST http://localhost:8080/api/products?token=:auth_token)
.put(function(req, res) {
    var products = req.body;

    var user = new User();
    user.token = req.query.token;

    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        for (var userIndex in users) {
            if (user.token === users[userIndex].token) {
                for (updateProduct in products) {
                    if (decrementProductStock(updateProduct, products[updateProduct]) <
                        1) {
                        res.json({
                            message: 'Error: Product not found trying to update quantity'
                        });
                    }
                }

                res.json({
                    message: 'All product quantities updated successfully'
                });
                return;
            }
        }
        res.status(401).send();
    });
})

// [Basic Authentication Required]
// create a product (accessed at POST http://localhost:8080/api/products?token=:auth_token)
.post(function(req, res) {
    var product = new Product(); // create a new instance of the Product model
    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.url = req.body.url;

    var user = new User();
    user.token = req.query.token;

    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        for (var userIndex in users) {
            if (user.token === users[userIndex].token) {
                // save the product and check for errors
                product.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({
                        message: 'Product successfully created'
                    });
                });
                return;
            }
        }
        res.status(401).send();
    });
})

// [Basic Authentication Required]
// get all the products (accessed at GET http://localhost:8080/products?token=:auth_token)
.get(function(req, res) {
    var user = new User();
    user.token = req.query.token;

    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        for (var userIndex in users) {
            if (user.token === users[userIndex].token) {
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
                return;
            }
        }
        res.status(401).send();
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
            res.json({
                message: 'Product successfully updated'
            });
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
        res.json({
            message: 'Product successfully deleted'
        });
    });
});

// on routes that end in /orders
// ----------------------------------------------------
router.route('/orders')

// [Basic Authentication Required]
// create a order (accessed at POST http://localhost:8080/orders?token=:auth_token)
.post(function(req, res) {
    var order = new Order(); // create a new instance of the Order model
    order.cart = req.body.cart;
    order.total = req.body.total;
    order.user = req.body.user;

    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        for (var userIndex in users) {
            if (order.user.token === users[userIndex].token) {
                // save the order and check for errors
                order.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({
                        message: 'Order successfully created'
                    });
                });
                return;
            }
        }
        res.status(401).send();
    });
})

// [Basic Authentication Required]
// get all the orders (accessed at GET http://localhost:8080/orders?token=:auth_token)
.get(function(req, res) {
    var user = new User();
    user.token = req.query.token;

    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        for (var userIndex in users) {
            if (user.token === users[userIndex].token) {
                Order.find(function(err, orders) {
                    if (err) {
                        res.send(err);
                    }
                    var orderResponse = "{";
                    var orderCount = 0;
                    for (order in orders) {
                        if (order == orders.length - 1) {
                            orderResponse +=
                                '"order' + orderCount + '":{"cart":' +
                                JSON.stringify(orders[order].cart) + ',"total":' +
                                orders[order].total + "}";
                        } else {
                            orderResponse +=
                                '"order' + orderCount + '":{"cart":' +
                                JSON.stringify(orders[order].cart) + ',"total":' +
                                orders[order].total + "},";
                        }
                        orderCount++;
                    }
                    orderResponse += "}";
                    res.set('Content-Type', 'text/json');
                    res.send(orderResponse);
                });
                return;
            }
        }
        res.status(401).send();
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
            res.json({
                message: 'Order successfully updated'
            });
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
        res.json({
            message: 'Order successfully deleted'
        });
    });
});

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {
    var user = new User(); // create a new instance of the User model
    user.token = req.body.token;

    // save the user and check for errors
    user.save(function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'User successfully created'
        });
    });
})

// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});


// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

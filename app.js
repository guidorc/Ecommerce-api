const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// import defined routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// use morgan to log incoming requests
app.use(morgan('dev'));

// setup body parsing
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// forward requests to specific routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Allow access from any client (prevent CORS errors)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        // tell browser which methods are available
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
});

// handle request to non specified routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// hande all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;
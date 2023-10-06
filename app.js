const express = require('express');
const app = express();
const morgan = require('morgan');

// import defined routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// use morgan to log incoming requests
app.use(morgan('dev'));

// forward requests to specific routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

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
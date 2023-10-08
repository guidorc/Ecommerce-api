const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import product model
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Failed to find products'
            });
        });
});

router.post('/', (req, res, next) => {
    // create new product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), 
        name: req.body.name,
        price: req.body.price
    });
    // save product to db
    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product successfully created',
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Product creation failed',
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'Unable to find requested product'
                });
            }            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // determine which properties will be updated
    const updateOps = {};
    for (const [propName, value] of Object.entries(req.body)) {
        updateOps[propName] = value;
    }
    // execute update operations
    Product.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import product model
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            ...doc.toObject(),
            info: {
              type: "GET",
              description: "Get product by id",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to find products",
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  // create new product
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  // save product to db
  product
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Product created successfully",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          info: {
            type: "GET",
            description: "Get product by id",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Product creation failed",
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          ...result.toObject(),
          info: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: "Unable to find requested product",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // determine which properties will be updated
  const updateOps = {};
  for (const [propName, value] of Object.entries(req.body)) {
    updateOps[propName] = value;
  }
  // execute update operations
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated successfully",
        info: {
          type: "GET",
          description: "Get product by id",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Product deleted successfully",
        info: {
          type: "GET",
          description: "Get all products",
          url: "http://localhost:3000/products",
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// handle requests to non specified routes
router.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

module.exports = router;

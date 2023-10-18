const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

// import models
const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            ...doc.toObject(),
            info: {
              type: "GET",
              description: "Get order by id",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to find orders",
        error: err,
      });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  // verify product exists in db
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      // create order db object
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      // save order to db
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Order created successfully",
        createdOrder: {
          _id: result.id,
          productId: result.product,
          quantity: result.quantity,
          info: {
            method: "GET",
            description: "Get product by id",
            url: "http://localhost:3000/products/" + result.product,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to create order",
        error: err,
      });
    });
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          ...result.toObject(),
          info: {
            type: "GET",
            description: "Get all orders",
            url: "http://localhost:3000/orders",
          },
        });
      } else {
        res.status(404).json({
          message: "Unable to find requested order",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Order deleted successfully",
        info: {
          type: "GET",
          description: "Get all orders",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;

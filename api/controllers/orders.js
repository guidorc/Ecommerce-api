// import models
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.get_all = async (req, res, next) => {
  try {
    const docs = await Order.find()
      .select("product quantity _id")
      .populate("product", "name")
      .exec();

    const orders = {
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

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Failed to find orders",
      error: err,
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

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
    const result = await order.save();

    return res.status(201).json({
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
  } catch (err) {
    res.status(500).json({
      message: "Failed to create order",
      error: err,
    });
  }
};

exports.get_by_id = async (req, res, next) => {
  try {
    const id = req.params.orderId;
    const order = await Order.findById(id)
      .select("product quantity _id")
      .populate("product")
      .exec();

    if (order) {
      res.status(200).json({
        ...order.toObject(),
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
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.orderId;
    await Order.deleteOne({ _id: id }).exec();
    res.status(200).json({
      message: "Order deleted successfully",
      info: {
        type: "GET",
        description: "Get all orders",
        url: "http://localhost:3000/orders",
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

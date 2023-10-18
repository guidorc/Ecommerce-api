const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

// configure storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept file
    cb(null, true);
  }
  // reject file
  cb(null, false);
};

// initialize multer parser
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // max 5mb images
  },
  fileFilter: fileFilter,
});

// import product model
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price referenceImage _id")
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

router.post(
  "/",
  checkAuth,
  upload.single("referenceImage"),
  (req, res, next) => {
    // create new product
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      referenceImage: (req.file && req.file.path) || "uploads/default.jpg",
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
  }
);

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price referenceImage _id")
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

router.patch("/:productId", checkAuth, (req, res, next) => {
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

router.delete("/:productId", checkAuth, (req, res, next) => {
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

const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

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

router.get("/", ProductsController.get_all);

router.post(
  "/",
  checkAuth,
  upload.single("referenceImage"),
  ProductsController.create
);

router.get("/:productId", ProductsController.get_by_id);

router.patch("/:productId", checkAuth, ProductsController.update);

router.delete("/:productId", checkAuth, ProductsController.delete);

// handle requests to non specified routes
router.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

module.exports = router;

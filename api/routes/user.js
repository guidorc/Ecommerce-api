const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const UserController = require("../controllers/user");

router.post("/signup", UserController.signup);

router.post("/signin", UserController.signin);

router.delete("/:userId", checkAuth, UserController.delete);

module.exports = router;

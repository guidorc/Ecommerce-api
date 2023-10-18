const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  // check if email address is available
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email address already in use",
        });
      } else {
        // encrypt password to store it on the db
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: "Unable to create user",
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created successfully",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: "Unable to create user",
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/signin", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      // verify user exists
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      } else {
        // verify password
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err || !result) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          // generate JWT
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          // return response
          return res.status(200).json({
            message: "Auth Succesfull",
            token,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.orderId;
  User.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "User deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;

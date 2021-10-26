var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../autenthicate");
var cors = require("./cors");
/* GET users listing. */
router.get("/", (req, res, next) => {
  User.find({})
    .populate("devices", "name")
    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      },
      (err) => next(err)
    );
});
router.post("/signup", (req, res, next) => {
  req.body.username
    ? User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
          if (err) {
            next(err);
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ succes: true, user: user.username });
          });
        }
      )
    : res.status(400).send({ succes: false });
});
router.post("/login", passport.authenticate("local"), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json({ succes: true, token, user: req.user._id });
});
router.get("/logout", (req, res, next) => {
  req.logOut();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "Logged out" });
});
module.exports = router;

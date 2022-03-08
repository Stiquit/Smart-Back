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
            res.json({
              success: true,
              user: { user: user.username, _id: user._id },
            });
          });
        }
      )
    : res.status(400).send({ success: false });
});
router.post("/signin", passport.authenticate("local"), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  User.findById(req.user._id).then(
    (user) => {
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token,
        user: { user: user.username, _id: user._id },
      });
    },
    (err) => next(err)
  );
});
router.get("/logout", (req, res, next) => {
  req.logOut();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "Logged out" });
});
module.exports = router;

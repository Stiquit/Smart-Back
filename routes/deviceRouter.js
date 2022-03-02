var express = require("express");
var deviceRouter = express.Router();
var Device = require("../models/device");
var Group = require("../models/groups");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../autenthicate");
var cors = require("./cors");

deviceRouter
  .route("/")
  .get(cors.corsWithOptions, (req, res, next) => {
    //Device.find({ user: req.user._id })
    Device.find({ user: "6101a5b3dc95ee33d833e2f0" })
      .populate("user", "username")
      .populate("group", "name")
      .then(
        (devices) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, devices });
        },
        (err) => next(err)
      );
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    req.body.user = req.user._id;
    Device.create(req.body).then((device) => {
      User.findById(req.user._id).then((user) => {
        user.devices.push(device);
        user.save().then((user) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, device });
        });
      });
    });
  })
  .put(cors.corsWithOptions, (req, res, next) => {})
  .delete(cors.corsWithOptions, (req, res, next) => {
    Device.deleteMany({ user: req.user._id }).then(
      (resp) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, resp });
      },
      (err) => next(err)
    );
  });

deviceRouter.route("/groups").get(cors.corsWithOptions, (req, res, next) => {
  Group.find({}, { user: 0 })
    .populate("devices", "name")
    .then(
      (g) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, groups: g });
      },
      (err) => next(err)
    );
});

deviceRouter
  .route("/:deviceId")
  .get(cors.corsWithOptions, (req, res, next) => {
    Device.findById(req.params.deviceId)
      .populate("user", "username")
      .then(
        (device) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, device });
        },
        (err) => next(err)
      );
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    Device.findByIdAndUpdate(
      req.params.deviceId,
      { $set: req.body },
      { new: true }
    ).then(
      (device) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, device });
      },
      (err) => next(err)
    );
  });

module.exports = deviceRouter;

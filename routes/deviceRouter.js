var express = require("express");
var deviceRouter = express.Router();
var Device = require("../models/device");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../autenthicate");
var cors = require("./cors");

deviceRouter
  .route("/")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Device.find({ user: req.user._id })
      .populate("user", "username")
      .then(
        (devices) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ succes: true, devices });
        },
        (err) => next(err)
      );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.user = req.user._id;
    Device.create(req.body).then((device) => {
      User.findById(req.user._id).then((user) => {
        user.devices.push(device);
        user.save().then((user) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ succes: true, device});
        });
      });
    });
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    Device.find()
      .populate("user", "username")
      .then(
        (devices) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ succes: true, devices });
        },
        (err) => next(err)
      );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Device.deleteMany({ user: req.user._id }).then(
      (resp) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ succes: true, resp });
      },
      (err) => next(err)
    );
  });
deviceRouter
  .route("/:deviceId")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Device.findById(req.params.deviceId)
      .populate("user", "username")
      .then(
        (device) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ succes: true, device });
        },
        (err) => next(err)
      );
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Device.findByIdAndUpdate(
      req.params.deviceId,
      { $set: req.body },
      { new: true }
    ).then(
      (device) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ succes: true, device });
      },
      (err) => next(err)
    );
  });
deviceRouter.route("/home").get(cors.corsWithOptions,(req,res,next)=>{
  
})
module.exports = deviceRouter;

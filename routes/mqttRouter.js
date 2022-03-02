var express = require("express");
var router = express.Router();
var mqtt = require("mqtt");
var mqttClient = mqtt.connect("mqtt://localhost:1883");
const Action = require("../models/action");
const Routine = require("../models/routine");
var authenticate = require("../autenthicate");
var cors = require("./cors");

router.route("/").post(cors.corsWithOptions, (req, res, next) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json({
    Status: `Message emmited to ${req.body.topic}`,
    Reply: "true",
  });
  /*
    const date = new Date();
    Action.create({
        user: req.user._id,
        device: req.body.device,
        payload: req.body.action,
        day: date.getDay(),
        hour: `${date.getHours()}:${date.getMinutes()}`,
      }).then(() => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({
          Status: `Message emmited to ${req.body.topic}`,
          Reply: message.toString(),
        });   
      });*/
});
router
  .route("/actions")
  .get(cors.corsWithOptions, (req, res, next) => {
    Action.find({ user: req.user._id })
      .populate("user", "username")
      .populate("device", "name")
      .then(
        (actions) => {
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json({ succes: true, actions });
        },
        (err) => next(err)
      );
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    Action.deleteMany({ user: req.user._id }).then(
      (resp) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ succes: true, resp });
      },
      (err) => next(err)
    );
  });
router.route("/routines").get(cors.corsWithOptions, (req, res, next) => {});

module.exports = router;

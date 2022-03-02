var express = require("express");
var router = express.Router();
var Routine = require("../models/routine");
var cors = require("./cors");

router.route("/").get(cors.corsWithOptions, (req, res, next) => {
  Routine.find()
    .populate("actions.device",["type","name"])
    .then(
      (r) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, routines: r });
      },
      (err) => next(err)
    );
});
module.exports = router;

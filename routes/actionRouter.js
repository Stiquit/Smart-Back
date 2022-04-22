const express = require("express");
const router = express.Router();
const Actions = require("../models/action");
const util = require("../utils");
const cors = require("./cors");
router.route("/").get((req, res, next) => {
  Actions.find()
    .populate({ path: "device", select: "name topic -_id" })
    .populate({ path: "routine", select: "name -_id" })
    .then((data) => {
      res.status(200).setHeader("Content-Type", "application/json").json(data);
    });
});
router.route("/top").get(cors.corsWithOptions, async (req, res, next) => {
  const actions = await Actions.aggregate([
    {
      $group: {
        _id: "$name",
        howMany: { $count: {} },
        device: { $first: "$device" },
      },
    },
    { $sort: { howMany: -1 } },
  ]);
  Actions.populate(actions, { path: "device", select: "type -_id" }).then(
    (populatedActions) => {
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ success: true, data: populatedActions.slice(0, 5) });
    }
  );
});
module.exports = router;

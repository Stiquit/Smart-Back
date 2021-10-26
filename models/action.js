const mongoose = require("mongoose");
const Action = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  payload: String,
  day: Number,
  hour: String,
});
module.exports = mongoose.model("Action", Action);

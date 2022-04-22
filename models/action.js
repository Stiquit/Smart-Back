const mongoose = require("mongoose");
const Action = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  routine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routine",
  },
  name: String,
  payload: String,
  day: Number,
  hour: String,
});
module.exports = mongoose.model("Action", Action);

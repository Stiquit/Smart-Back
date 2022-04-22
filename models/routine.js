const mongoose = require("mongoose");
const Routine = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  day: String,
  hour: String,
  minutes: String,
  actions: [
    {
      topic: String,
      payload: String,
      device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    },
  ],
});
module.exports = mongoose.model("Routine", Routine);

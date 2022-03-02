const mongoose = require("mongoose");
const Device = new mongoose.Schema({
  name: String,
  topic: String,
  number: Number,
  type: String,
  state: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: "",
  },
});
module.exports = mongoose.model("Device", Device);

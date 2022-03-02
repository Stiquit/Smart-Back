const mongoose = require("mongoose");
const Group = new mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  devices: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Device",
    },
  ],
});
module.exports = mongoose.model("Group", Group);

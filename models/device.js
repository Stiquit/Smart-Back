const mongoose = require("mongoose");
const Device = new mongoose.Schema({
  name: String,
  topic: String,
  number: Number,
  type: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
});
module.exports = mongoose.model("Device", Device);

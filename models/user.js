const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const User = new mongoose.Schema({
  username: String,
  password: String,
  devices: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Device",
    },
  ],
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);

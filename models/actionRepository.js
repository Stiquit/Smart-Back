var mongoose = require("mongoose");
var action = require("./action");
var device = require("./device");
var routine = require("./routine");
var user = require("./user");

var Actions = {};

Actions.choseModel = (model = "") => {
  switch (model) {
    case "action":
      return action;
    case "device":
      return device;
    case "routine":
      return routine;
    case "user":
      return user;
  }
};
Actions.add = (model = "") => {
  var currentModel = Actions.choseModel(model);
};

module.exports = Actions;

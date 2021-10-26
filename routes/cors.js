
const cors = require("cors");

const whitelist = [
  "http://localhost:3000",
  "https://localhost:3443",
  "http://localhost:5000",
]; /**Contains all the origins that the server is willing to accept */
var corsOptionDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
exports.corsWhiteList = whitelist;
exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);

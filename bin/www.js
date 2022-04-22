#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("smartst-backend:server");
var cors = require("../routes/cors");
var utils = require("../utils");
var Actions = require("../models/action");
var { Server } = require("socket.io");
var { io } = require("socket.io-client");
var http = require("http");
var mongoose = require("mongoose");
const aedesPersistence = require("aedes-persistence");
const aedes = require("aedes")();

/**MongoDb server initializaction */
const connect = mongoose.connect(
  //"mongodb+srv://Stiquit:Peluza9709@cluster0.jcld4.mongodb.net/SmartSt?retryWrites=true&w=majority",
  "mongodb://localhost:27017/SmartSt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
connect.then(
  () => console.log(`connected to mongo server`),
  (err) => console.error(err)
);

/**HTTP Server initialization */ /**WebSocket Server initialization */ /** MQTT Server initialization */

const mqttServer = require("net").createServer(aedes.handle);
const mqttPort = 1883;

/*Aca al mqtt y se reciben los mensajes para la com full duplex */
var mqtt = require("mqtt");

var appPort = 8888;
var port = normalizePort(process.env.PORT || appPort);
app.set("port", port);
var server = http.createServer(app);
var ioServer = new Server(server, {
  cors: {
    origin: "*",
  },
});
var ioSocket = io("http://localhost:8888", {
  reconnectionDelayMax: 5000,
});

mqttServer.listen(mqttPort, () =>
  console.log(`Mqtt server listening at port ${mqttPort}`)
);
ioServer.on("connection", (socket) => {
  socket.on("device", (d) => {
    utils.deviceHandler(d.topic, d.payload, d.device, mqttClient);
    utils.addOne(Actions, d);
  });
  socket.on("routine", (r) => {
    utils.routineHandler(r.actions, mqttClient);
    utils.addOne(Actions, r);
  });
  socket.on("disconnect", () => socket.removeAllListeners());
  socket.on("reply", (a) => ioServer.emit("reply", a));
  socket.on("routineReply", (a) => ioServer.emit("routineReply", a));
});
var mqttClient = mqtt.connect("mqtt://192.168.0.21:1883");
mqttClient.on("connect", (packet) => {
  mqttClient.subscribe(["reply", "routineReply"]);
});

mqttClient.on("message", (topic, payload, packet) => {
  console.log(`MQTT message to ${topic}: ${String(payload)}`);
  ioSocket.emit(topic, String(payload));
});

server.listen(port, () => {
  console.log("websocket server listening on port " + port);
});

server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

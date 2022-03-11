const delay = require("delay");
var mqtt = require("mqtt");
const actionsToFunction = {
  turn: (topic, payload, device) => deviceHandler(topic, payload, device),
  time: async (payload) => {
    console.log("Starting delay...");
    await delay(payload);
    console.log(`delay of ${payload} done`);
  },
};
const timeHandler = async (payload) => {
  return new Promise((resolve, reject) => setTimeout(resolve, payload));
};

const deviceHandler = (topic = "", payload = "", _id = "", mqttClient) => {
  mqttClient.publish("reply", "false");
  console.log(`Sending through MQTT: ${topic}-${payload}`);
  mqttClient.publish(topic, String(payload));
};

const routineHandler = async (actions = [], mqttClient) => {
  mqttClient.publish("routineReply", "false");
  for (const a of actions) {
    if (a.type === "time") {
      await timeHandler(a.payload);
    } else {
      deviceHandler(a.topic, a.payload, a.device, mqttClient);
    }
  }
  mqttClient.publish("routine", "");
};

exports.deviceHandler = deviceHandler;
exports.routineHandler = routineHandler;

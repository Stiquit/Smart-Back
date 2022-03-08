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
const timeHandler = async (payload, mqttClient) => {
  return new Promise((resolve, reject) => setTimeout(resolve, payload));
};

const deviceHandler = (topic = "", payload = "", _id = "", mqttClient) => {
  mqttClient.publish("reply", "false");
  console.log(`Sending through MQTT: ${topic}-${payload}`);
  mqttClient.publish(topic, String(payload));
};

const routineHandler = async (actions = [], mqttClient) => {
  for (const a of actions) {
    if (a.type === "time") {
      await timeHandler(a.payload, mqttClient);
    } else {
      deviceHandler(a.topic, a.payload, a.device, mqttClient);
    }
  }
};

exports.deviceHandler = deviceHandler;
exports.routineHandler = routineHandler;

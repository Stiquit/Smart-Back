const delay = require("delay");
const Action = require("./models/action");

//Database utilites

const addOne = async (model, toAdd) => {
  const now = new Date();
  toAdd = {
    ...toAdd,
    day: now.getDay(),
    hour: `${now.getHours()}:${now.getMinutes()}`,
  };
  await model.create(toAdd);
};
const find = async (model, filter) => {
  await model.find(filter);
};
//Server utilities

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
exports.addOne = addOne;
exports.find = find;

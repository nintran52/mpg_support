const mqtt = require("mqtt");
const fs = require("fs");
const polyline = require("google-polyline");
var moment = require("moment");

const config = {
  brokerUrl: "mqtt://broker-stg.ionmobility.net",
  username: "09478c60-2d31-41f4-bdda-a9906e9c5b54",
  password: "fa2330ce-2c68-4f30-90a9-b7873d6b01f5",
  topic: "channels/0dd60cb2-92e0-4b74-8459-3a821631a3a1/messages/client/gps",
};
// MQTT broker details
const options = {
  port: 8883, // MQTT over TLS typically uses port 8883
  clientId: "mqttjs_" + randomId(),
  username: config.username,
  password: config.password,
  protocol: "mqtts", // Specify that MQTT over TLS should be used
  rejectUnauthorized: false, // Set to true if your CA certificate should be validated
  ca: [fs.readFileSync("ca.crt")],
  cert: fs.readFileSync("thing.crt"),
  key: fs.readFileSync("thing.key"),
};

// Connect to MQTT broker
const client = mqtt.connect(config.brokerUrl, options);

// Event handlers
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  var routes = polyline.decode(
    "_ygkFpgyv@?G@I@I@GBAB@B?@?B@B?B@D?B?B@D@B@B?B?D@D?D@D@F?D@FB?FADAFAJAFAJAF?HGAGAIAI?GAGAGAGAIAGAGAE?AE?E@G?G???G"
  );
  routes.forEach(pushMessage);
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  // Handle the received message
});

client.on("error", (err) => {
  console.error(`Error: ${err}`);
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("offline", () => {
  console.log("Client is offline");
});

// Handle SIGINT (Ctrl+C) gracefully
process.on("SIGINT", () => {
  client.end(() => {
    console.log("Disconnected from MQTT broker");
    process.exit();
  });
});

function randomId() {
  return (Math.random() + 1).toString(36).substring(7);
}

let gpsTemplate = {
  device_id: "00-B0-D0-63-C2-26",
  timestamp: "2023-08-08 11:14:14.23 UTC",
  lat_deg: 101.24,
  lng_deg: 82.12,
  heading_deg: 0.2,
  epx_m: 1.4,
  epy_m: 1.4,
};

function pushMessage(item, index) {
  if (client.connected) {
    setTimeout(() => {
      gpsTemplate.timestamp = moment().toISOString();
      gpsTemplate.lat_deg = item[0];
      gpsTemplate.lng_deg = item[1];
      console.log(JSON.stringify(gpsTemplate));
      client.publish(config.topic, JSON.stringify(gpsTemplate));
    }, 5000 * index);
  } else {
    console.log("Client not connected");
  }
}

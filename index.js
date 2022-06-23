var mqtt = require("mqtt");
var polyline = require("google-polyline");
var moment = require("moment");

function randomId() {
  return (Math.random() + 1).toString(36).substring(7);
}

function randomInteger(min, max) {
  return Math.random() * (max - min) + min;
}

function randomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

var options = {
  port: 1883,
  clientId: "mqttjs_" + randomId(),
  username: "username",
  password: "password",
};

var client = mqtt.connect("tcp://mqtt.mypetgo.com", options);

var templatePetHealth = {
  header: {
    id: "deviceCode",
    dat: "2022-04-13T09:11:13Z",
    net: "W",
  },
  data: {
    lat: 16.0742,
    lon: 108.17687,
    alt: 5.7,
    tmp: 38.68,
    env: 27.53,
    ste: 0,
  },
};

// Use this link to create route
// https://developers.google.com/maps/documentation/utilities/polylineutility
client.on("connect", function () {
  var routes = polyline.decode(
    "_ygkFpgyv@?G@I@I@GBAB@B?@?B@B?B@D?B?B@D@B@B?B?D@D?D@D@F?D@FB?FADAFAJAFAJAF?HGAGAIAI?GAGAGAGAIAGAGAE?AE?E@G?G???G"
  );
  routes.forEach(pushMessage);
});

function pushMessage(item, index) {
  const deviceCode = "7C:9E:BD:6E:89:9C";

  setTimeout(() => {
    let dateTime = moment().toISOString();

    templatePetHealth.header.id = deviceCode;
    templatePetHealth.header.dat = dateTime;
    templatePetHealth.data.lat = item[0];
    templatePetHealth.data.lon = item[1];
    templatePetHealth.data.alt = randomFloat(0.4, 14.32);
    templatePetHealth.data.ste = randomInteger(10, 20);
    client.publish("pet", JSON.stringify(templatePetHealth));
    console.log(JSON.stringify(templatePetHealth));
  }, 7000 * index);
}

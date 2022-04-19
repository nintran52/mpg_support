var mqtt = require("mqtt");
var moment = require("moment");
var polyline = require("google-polyline");

var options = {
  port: 1883,
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  username: "username", //username
  password: "password", //password
};

var client = mqtt.connect("tcp://mqtt.mypetgo.com", options);

var template = {
  header: {
    did: "7C:9E:BD:6E:89:9C", //device code
    dateTime: "",
    net: "W",
  },
  data: {
    lat: 16.0742,
    lon: 108.17687,
  },
};

var templatePetHealth = {
  header: {
    did: "7C:9E:BD:6E:89:9C",
    dateTime: "2022-04-13T09:11:13Z",
    net: "W",
  },
  data: {
    petTemp: 29.68,
    envTemp: 28.53,
    bat: 79,
    motion: 0,
    steps: 0,
    itchScratch: 0,
    eatDrink: 0,
    resting: 0,
    sleeping: 37,
    sitting: 0,
    standing: 0,
    netInfo: {
      ssid: "Rhino1",
      ip: "192.168.88.136",
      mac: "cc:71:90:09:0d:ea",
      rssi: -52,
    },
  },
};

// Use this link to create route
// https://developers.google.com/maps/documentation/utilities/polylineutility
client.on("connect", function () {
  var routes = polyline.decode(
    "y{{`Bc{tsS?[b@Uf@SWi@Sk@[s@WaAXp@Zp@Tl@Vr@i@Zo@THX"
  );
  routes.forEach(pushMessage);
});

function pushMessage(item, index) {
  setTimeout(() => {
    let dateTime = moment().toISOString();
    template.data.lat = item[0];
    template.data.lon = item[1];
    template.header.dateTime = dateTime;
    // console.log(JSON.stringify(template));
    client.publish("gps", JSON.stringify(template));

    templatePetHealth.header.dateTime = dateTime;
    templatePetHealth.data.steps = Math.round(Math.random() * (25 - 10) + 10); //min max
    console.log(JSON.stringify(templatePetHealth));
    client.publish("health", JSON.stringify(templatePetHealth));
  }, 7000 * index);
}

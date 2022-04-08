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
    did: "7C:9E:BD:6E:89:8C", //device code
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
    did: "7C:9E:BD:6E:89:8C", //device code
    dateTime: "",
    net: "W",
  },
  data: {
    petTemp: 15,
    envTemp: 15,
    bat: 69,
    steps: 15,
    netInfo: {
      ssid: "OPPO Tom Reno2",
      ip: "192.168.127.234",
      mac: "FE:11:7C:49:91:E2",
      rssi: -42,
    },
  },
};

// Use this link to create route
// https://developers.google.com/maps/documentation/utilities/polylineutility
client.on("connect", function () {
  var routes = polyline.decode(
    "{{{`Bc{tsSGWYHe@PSo@Qq@Qo@Qs@`@SZQXKPKTMPj@Ph@P^JZJXJ`@e@NULEj@"
  );
  routes.forEach(pushMessage);
});

function pushMessage(item, index) {
  setTimeout(() => {
    let dateTime = moment().toISOString();
    template.data.lat = item[0];
    template.data.lon = item[1];
    template.header.dateTime = dateTime;
    console.log(JSON.stringify(template));
    client.publish("petcare/server/gps", JSON.stringify(template));

    // templatePetHealth.header.dateTime = dateTime;
    // templatePetHealth.data.steps = Math.round(Math.random() * (25 - 10) + 10); //min max
    // client.publish("petcare/server/health", JSON.stringify(templatePetHealth));
  }, 5000 * index);
}

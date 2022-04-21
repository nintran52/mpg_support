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

var template = {
  header: {
    did: "deviceCode",
    dateTime: "2022-04-13T09:11:13Z",
    net: "W",
  },
  data: {
    lat: 16.0742,
    lon: 108.17687,
    altitude: 12.7,
  },
};

var templatePetHealth = {
  header: {
    did: "deviceCode",
    dateTime: "2022-04-13T09:11:13Z",
    net: "W",
  },
  data: {
    petTemp: 29.68,
    envTemp: 28.53,
    bat: 69,
    motion: 0,
    steps: 0,
    itchScratch: 0,
    eatDrink: 0,
    resting: 0,
    sleeping: 0,
    sitting: 0,
    standing: 0,
    netInfo: {
      ssid: "MyPetGo",
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
    "adeGmnmxRa@KSa@Uc@Ue@Uc@Qe@Z_@ZWZOX^Vb@Pb@P^V`@P^T`@Ll@k@Bq@BIS"
  );
  routes.forEach(pushMessage);
});

function pushMessage(item, index) {
  const deviceCode = "7C:9E:BD:6E:89:44";

  setTimeout(() => {
    let dateTime = moment().toISOString();

    template.header.did = deviceCode;
    template.header.dateTime = dateTime;
    template.data.lat = item[0];
    template.data.lon = item[1];
    template.data.altitude = randomFloat(0.4, 14.32);
    client.publish("gps", JSON.stringify(template));
    console.log(JSON.stringify(template));

    templatePetHealth.header.did = deviceCode;
    templatePetHealth.header.dateTime = dateTime;
    templatePetHealth.data.petTemp = randomFloat(33.54, 40.43);
    templatePetHealth.data.envTemp = randomFloat(27.32, 33.53);
    templatePetHealth.data.motion = randomInteger(1, 10);
    templatePetHealth.data.steps = randomInteger(10, 20);
    client.publish("health", JSON.stringify(templatePetHealth));
    console.log(JSON.stringify(templatePetHealth));
  }, 7000 * index);
}

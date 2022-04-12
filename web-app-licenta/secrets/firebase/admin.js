var admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');

var serviceAccount = require("./licenta-3e164-firebase-adminsdk-370oq-a72d1554a2.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://licenta-3e164-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const getDatbase = getDatabase();

const pathDatabase = getDatbase.ref('/');
const moistureDatabase = getDatbase.ref('/sensors/moisture');
const smokeDatabase = getDatbase.ref('/sensors/smoke');
const temperatureAndHumidityDatabase = getDatbase.ref('/sensors/temperature-and-humidity');
temperatureAndHumidityDatabase.once('value', function (snap){
    console.log(snap.toJSON());
})

module.exports = { admin, db, pathDatabase, moistureDatabase, smokeDatabase, temperatureAndHumidityDatabase };
const path = require( 'path' );
const express = require( 'express' );
const socket = require( 'socket.io' );

const { moistureDatabase, smokeDatabase, temperatureAndHumidityDatabase } = require( './firebase/admin' );

// import LED control API
const { toggle } = require( './led-api' );

// create an express app
const app = express();

// send asset files
app.use( '/assets/', express.static( path.resolve( __dirname, 'web-app' ) ) );
app.use( '/assets/', express.static( path.resolve( __dirname, 'node_modules/socket.io-client/dist' ) ) );
app.use(express.json());
app.use(express.urlencoded());

// APIs
//---------default PATH--------
app.get( '/', ( request, response ) => {
  response.sendFile( path.resolve( __dirname, 'web-app/index.html' ), {
    headers: {
      'Content-Type': 'text/html',
    }
  } );
} );

// server listens on `9000` port
const server = app.listen( 9000, () => console.log( 'Express server started!' ) );

// create a WebSocket server
const io = socket(server);

//---------GET MOTION SENSOR DATA--------
app.post('/motion-sensor-data', (req, res) => {
  let motionSensorData = req.body;
  console.log(motionSensorData);
  io.emit('motionSensorEvent',{"isActivated":motionSensorData.isActivated});
  res.send("Data received");
});

//---------GET MOTION SENSOR DATA--------
app.post('/get-temperature-data', (req, res) => {
  let sht21Data = req.body;
  let currentTime = require('./methods/getTime');
  console.log(currentTime);
  console.log(sht21Data);
  io.emit('sht21Event',sht21Data);
  res.send("Data received");
});

//---------GET SMOKE SENSOR DATA--------
app.post('/get-smoke-data', (req, res) => {
  let mq135Data = req.body;
  console.log(mq135Data);
  io.emit('mq135Event',mq135Data);
  res.send("Data received");
});

// listen for connection
io.on( 'connection', ( client ) => {
  console.log( 'SOCKET: ', 'A client connected', client.id );
  // client.on( 'led-toggle', ( data ) => {
  //   console.log( 'Received led-toggle event.' );
  //   toggle( data.r, data.g, data.b ); // toggle LEDs
  // } );
} );
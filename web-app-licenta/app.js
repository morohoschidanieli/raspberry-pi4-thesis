const express = require( 'express' );
const app = express();
var config = require ('./config/config.js');
var piblaster = require ( 'pi-blaster.js' );

const path = require( 'path' );

const socket = require( 'socket.io' );
// const videoStream = require( 'raspberrypi-node-camera-web-streamer' );
const fs = require('fs')

const { pathDatabase, moistureDatabase, smokeDatabase, temperatureAndHumidityDatabase } = require( './secrets/firebase/admin.js' );

// import LED control API
const { toggle } = require( './led-api' );

// start capture
const videoStream = require('./videoStream');
const rgb = require('./api-routes/rgb.js');

videoStream.acceptConnections(app, {
        width: 1280,
        height: 720,
        fps: 16,
        encoding: 'JPEG',
        quality: 7 // lower is faster, less quality
    },
    '/stream.mjpg', true);

// send asset files
app.use( '/assets/', express.static( path.resolve( __dirname, 'public' ) ) );
app.use( '/assets/', express.static( path.resolve( __dirname, 'node_modules/socket.io-client/dist' ) ) );
app.use(express.json());
app.use(express.urlencoded());

// server listens on `9000` port
const server = app.listen( config.port, () => console.log( 'Express server started! on port' + config.port ) );

// create a WebSocket server
const io = socket(server);

// APIs
require('./api-routes/home.js')(app);
require('./api-routes/analytics.js')(app);
require('./api-routes/motion-sensor.js')(app, io);
require('./api-routes/rgb.js')(app, io);
require('./api-routes/sht21.js')(app, io);
require('./api-routes/smoke.js')(app, io);
let horizontaInitialValue = 0.17;
let verticalInitialValue = 0.17;

//Set ox initial position for camera
piblaster.setPwm(21, horizontaInitialValue);
//Set oy initial position for camera
piblaster.setPwm(20, verticalInitialValue);


//listen for connection
io.on( 'connection', ( client ) => {

  console.log( 'SOCKET: ', 'A client connected', client.id );
  client.on( 'led-toggle', ( data ) => {
    console.log( 'Received led-toggle event.' );
  } );

  client.on( 'moveServoLeft', ( data ) => {
    console.log( 'Received move left event.' );
    horizontaInitialValue += 0.001;
    if(horizontaInitialValue <=0.27){
      horizontaInitialValue += 0.001;
    piblaster.setPwm(21, horizontaInitialValue);
    }
  } );

  client.on( 'moveServoRight', ( data ) => {
    console.log( 'Received move right event.' );
    horizontaInitialValue -= 0.001;
    if(horizontaInitialValue >= 0.029){
      horizontaInitialValue -= 0.001;
    piblaster.setPwm(21, horizontaInitialValue);
    }
  } );

  client.on( 'moveServoUp', ( data ) => {
    console.log( 'Received move up event.' );
    verticalInitialValue -= 0.001;
    if(verticalInitialValue > 0.029){
      verticalInitialValue -= 0.001;
    piblaster.setPwm(20, verticalInitialValue);
    }
  } );

  client.on( 'moveServoDown', ( data ) => {
    console.log( 'Received move down event.' );
    verticalInitialValue += 0.001;
    if(verticalInitialValue < 0.28){
      verticalInitialValue += 0.001;
    piblaster.setPwm(20, verticalInitialValue);
    }
  } );

} );
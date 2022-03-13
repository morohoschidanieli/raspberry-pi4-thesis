const path = require( 'path' );
const express = require( 'express' );
const socket = require( 'socket.io' );

const { pathDatabase, moistureDatabase, smokeDatabase, temperatureAndHumidityDatabase } = require( './firebase/admin' );

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

//---------GET RGB DATA--------
app.post('/rgb-data', (req, res) => {
  let rgbData = req.body;
  const previousData = pathDatabase.child(`sensors/rgb-data/`);
  previousData.set({
    red: rgbData.red,
    green : rgbData.green,
    blue :  rgbData.blue
  })
  console.log(rgbData);
  //io.emit('motionSensorEvent',{"isActivated":motionSensorData.isActivated});
  res.send("Data received");
});

//---------GET MOTION SENSOR DATA--------
app.post('/get-temperature-data', (req, res) => {
  let sht21Data = req.body;

  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  if(seconds < 10){
      seconds ='0' + seconds;
  }
  if(minutes < 10){
      minutes ='0' + minutes;
  }
  if(hours < 10){
      hours ='0' + hours;
  }
  
  const currentTime = hours + ':' + minutes;
  const currentDate = date + '-' + month + '-' + year;

  const previousData = pathDatabase.child(`sensors/temperature-and-humidity/${currentDate}/${currentTime}`);

  if(minutes == '30' || minutes == '00'){
    previousData.set({
      temperature: sht21Data.temperature,
      humidity : sht21Data.humidity
    })
  }
  console.log(sht21Data);
  io.emit('sht21Event',sht21Data);
  res.send("Data received");
});

//---------GET SMOKE SENSOR DATA--------
app.post('/get-smoke-data', (req, res) => {
  let mq135Data = req.body;
  
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  if(seconds < 10){
      seconds ='0' + seconds;
  }
  if(minutes < 10){
      minutes ='0' + minutes;
  }
  if(hours < 10){
      hours ='0' + hours;
  }
  
  const currentTime = hours + ':' + minutes;
  const currentDate = date + '-' + month + '-' + year;

  const previousData = pathDatabase.child(`sensors/smoke/${currentDate}/${currentTime}`);

  if(minutes == '30' || minutes == '00'){
    previousData.set({
      CO: mq135Data.C0,
      CO2 : mq135Data.Smoke
    })
  }
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
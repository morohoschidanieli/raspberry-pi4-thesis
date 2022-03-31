var cameraModule = {

    $toggleRecordingButton: $("#toggle-recording-action"),
    $toggleCaptureButton: $("#toggle-capture-action"),

    $startingRecordingMessage: $(".js-recording-text"),

    toggleCapture: function(){
        this.$toggleRecordingButton.click(function(){
            $(".js-recording-text").toggleClass('hidden');
            $(this).toggleClass('active');
        })
    }

};

// Outputs: Where in the world is Paul Irish today?
cameraModule.toggleCapture();

// get button elements
// var button_red = document.getElementById( 'button-red' );
// var button_green = document.getElementById( 'button-green' );
// var button_blue = document.getElementById( 'button-blue' );
var addRgbButton = document.getElementById('change-rgb');
var leftButton = document.getElementById('left');
var rightButton = document.getElementById('right');
var upButton = document.getElementById('up');
var downButton = document.getElementById('down');

// initial button states
var button_red_state = false;
var button_green_state = false;
var button_blue_state = false;

// check for active connection
var isConnectionActive = false;


// connect to the Web Socket server
var connection = io( '192.168.0.122:9000' );

// when connection is established 
connection.on( 'connect', () => {
  isConnectionActive = true;
} );

connection.on( 'disconnect', () => {
  isConnectionActive = false;
} );

connection.on( 'motionSensorEvent', (data) => {
  document.getElementById('motionData').innerHTML="Detectie senzor PIR: " + data.isActivated;
  console.log(data);
} );


connection.on( 'sht21Event', (data) => {
  document.getElementById('temperatureData').innerHTML="Temperatura: " + data.temperature + ' gradC';
  document.getElementById('humidityData').innerHTML="Umiditate: " + data.humidity + ' %';
  console.log(data);
} );

connection.on( 'mq135Event', (data) => {
  document.getElementById('COData').innerHTML="CO: " + data.C0 + ' ppm';
  document.getElementById('CO2Data').innerHTML="CO2: " + data.Smoke + ' ppm';
  document.getElementById('alarmData').innerHTML="Alarm: " + data.isAlarmOn;
  console.log(data);
} );

// WebSocket event emitter function
var emitEvent = function( event ) {
  var redValue = document.getElementById('red-input').value;
var greenValue = document.getElementById('green-input').value;
var blueValue = document.getElementById('blue-input').value;

  if( ! isConnectionActive ) {
    return alert( 'Server connection is closed!' );
  }

  // change button state
  // if( event.target.id === 'button-red') { button_red_state = ! button_red_state; }
  // if( event.target.id === 'button-green') { button_green_state = ! button_green_state; }
  // if( event.target.id === 'button-blue') { button_blue_state = ! button_blue_state; }

  // emit `led-toggle` socket event
  connection.emit( 'led-toggle', {
    'red': redValue,
    'green': greenValue,
    'blue': blueValue
  } );

};

var emitLeftEvent = function( event ) {
  connection.emit( 'moveServoLeft' );
};


var emitRightEvent = function( event ) {
  connection.emit( 'moveServoRight');
};

var emitUpEvent = function( event ) {
  connection.emit( 'moveServoUp');
};

var emitDownEvent = function( event ) {
  connection.emit( 'moveServoDown');
};



leftButton.addEventListener( 'click' , emitLeftEvent);
rightButton.addEventListener( 'click' , emitRightEvent);
upButton.addEventListener( 'click' , emitUpEvent);
downButton.addEventListener( 'click' , emitDownEvent);
const cameraModule = {
    init: function () {
        cameraModule.config = {
            //Camera option buttons
            $toggleRecordingButton: $("#toggle-recording-action"),
            $toggleCaptureButton: $("#toggle-capture-action"),
            $toggleStreamButton: $("#toggle-stream"),
            $startingRecordingMessage: $(".js-recording-text"),

            //Camera move buttons
            $moveUpCameraButton: $("#up"),
            $moveDownCameraButton: $("#down"),
            $moveRightCameraButton: $("#right"),
            $moveLeftCameraButton: $("#left"),

            //Refresh stream
            $refreshStreamButton: $("#refresh-stream"),

            //Camera record text
            $startRecording: $(".js-recording-text"),

            //Stream source
            $streamSource: $("#stream-src"),
        }

        let img = $("<img src='stream.mjpg' />");

        img.on('load', function (e) {
            cameraModule.config.$streamSource.attr("src", "stream.mjpg");

            //Show arrows for camera control
            cameraModule.config.$moveUpCameraButton.show();
            cameraModule.config.$moveDownCameraButton.show();
            cameraModule.config.$moveRightCameraButton.show();
            cameraModule.config.$moveLeftCameraButton.show();
        }).on('error', function (e) {
            cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/no-video-stream.png");

            cameraModule.config.$toggleRecordingButton.attr("disabled", true);
            cameraModule.config.$toggleStreamButton.attr("disabled", true);
            cameraModule.config.$toggleCaptureButton.attr("disabled", true);
        });
    },

    toggleCapture: function () {
        cameraModule.config.$toggleRecordingButton.click(function () {
            cameraModule.config.$startRecording.toggleClass('hidden');
            $(this).toggleClass('active');

            const hasClassActive = $(this).hasClass('active');

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasClassActive ? true : false);
            cameraModule.config.$toggleStreamButton.attr("disabled", hasClassActive ? true : false);
        })
    },

    toggleVideoStream: function () {
        cameraModule.config.$toggleStreamButton.click(function () {
            cameraModule.config.$toggleStreamButton.toggleClass("stop-camera start-camera");

            const hasStartCameraClass = cameraModule.config.$toggleStreamButton.hasClass('start-camera');

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasStartCameraClass ? true : false);
            cameraModule.config.$toggleRecordingButton.attr("disabled", hasStartCameraClass ? true : false);

            if (hasStartCameraClass) {
                let img = $("<img src='stream.mjpg' />");

                img.on('load', function (e) {
                    cameraModule.config.$streamSource.attr("src", "stream.mjpg");

                    //Show arrows for camera control
                    cameraModule.config.$moveUpCameraButton.show();
                    cameraModule.config.$moveDownCameraButton.show();
                    cameraModule.config.$moveRightCameraButton.show();
                    cameraModule.config.$moveLeftCameraButton.show();
                }).on('error', function (e) {
                    cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/disabled-video-stream.png");
                });
            } else {
                cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/no-video-stream.png");

                //Hide arrows for camera control
                cameraModule.config.$moveUpCameraButton.hide();
                cameraModule.config.$moveDownCameraButton.hide();
                cameraModule.config.$moveRightCameraButton.hide();
                cameraModule.config.$moveLeftCameraButton.hide();
            }
        })
    },

    refresh : function(){
        cameraModule.config.$refreshStreamButton.click(function(){
            cameraModule.init()
        });
    }

};

cameraModule.init();
cameraModule.refresh();
cameraModule.toggleCapture();
cameraModule.toggleVideoStream();

const connectionIp='192.168.0.122:9000';

const humidityModule = {
    init: function(){
        humidityModule.config={
            $humidityValue: $(".js-humidity-value"),
            $humidityLoading: $(".js-loading-temperature"),
            $humidityContainer: $(".humidity__background"),

            //colors
            $ideal_humidity_color: '#4ac687',
            $fair_humidity_color: '#ffc001',
            $poor_humidity_color: '#f54454',

            isConnectionActive: false,
            connection: io(connectionIp)
        }
    },

    connect: function(){
        // when connection is established
        humidityModule.config.connection.on( 'connect', () => {
            humidityModule.config.isConnectionActive = true;
        } );
    },

    disconnect: function(){
        humidityModule.config.connection.on( 'disconnect', () => {
            humidityModule.config.isConnectionActive = false;
        } );
    },

    getHumidity: function(){
        humidityModule.config.connection.on( 'sht21Event', (data) => {
            if(data.humidity !== ' '){
                humidityModule.config.$humidityLoading.hide();
                humidityModule.config.drawHumidity(data.humidity);
            }
            console.log(data.humidity);
        } );
        let number = 32.12312;
        humidityModule.drawHumidity(number);
    },

    drawHumidity: function(sensorHumidity){
        let humidity = sensorHumidity.toFixed(2);
        humidityModule.config.$humidityLoading.hide();
        humidityModule.config.$humidityValue.text(`${humidity} %`);

        if(humidity < 25){
            humidityModule.config.$humidityContainer.css({"border":`2px solid ${humidityModule.config.$poor_humidity_color}`, "color":`${humidityModule.config.$poor_humidity_color}`});
        }else if(humidity >= 25 && humidity < 30){
            humidityModule.config.$humidityContainer.css({"border":`2px solid ${humidityModule.config.$fair_humidity_color}`, "color":`${humidityModule.config.$fair_humidity_color}`});
        }else if(humidity >= 30 && humidity < 60){
            humidityModule.config.$humidityContainer.css({"border":`2px solid ${humidityModule.config.$ideal_humidity_color}`, "color":`${humidityModule.config.$ideal_humidity_color}`});
        }else if(humidity >= 60 && humidity < 70){
            humidityModule.config.$humidityContainer.css({"border":`2px solid ${humidityModule.config.$fair_humidity_color}`, "color":`${humidityModule.config.$fair_humidity_color}`});
        }else{
            humidityModule.config.$humidityContainer.css({"border":`2px solid ${humidityModule.config.$poor_humidity_color}`, "color":`${humidityModule.config.$poor_humidity_color}`});
        }
    }
}

$(document).ready(function() {
    humidityModule.init();
    humidityModule.connect();
    humidityModule.disconnect();
    humidityModule.getHumidity();
});

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

const temperatureModule={
    init: function (){
        temperatureModule.config = {
            $temperatureContainer: $(".js-temperature-progress-bar"),
            $temperatureLoading: $(".js-loading-temperature"),
            $progressBar: $(".progress-bar__background"),

            //colors
            //Temperature colors
            $cold: '#13D9E4',
            $cool: '#116FE3',
            $slightly_cool: '#634FDC',
            $neutral: '#923FD7',
            $slightly_warm: '#BB3ED6',
            $warm: '#D73F94',
            $hot: '#D94B41',

            //gray colors
            $cold_gray: '#ababab',
            $cool_gray: '#9c9c9c',
            $slightly_cool_gray: '#949494',
            $neutral_gray: '#8c8c8c',
            $slightly_warm_gray: '#828282',
            $warm_gray: '#737373',
            $hot_gray: '#666666',

            isConnectionActive: false,
            connection: io(connectionIp),
        }
    },

    getTemperature: function(){
        temperatureModule.config.connection.on( 'sht21Event', (data) => {
            if(data.temperature !== ' '){
                temperatureModule.config.$temperatureLoading.hide();
                temperatureModule.drawProgressBar(data.temperature);
            }
            console.log(data.temperature);
        } );
        let number = 29.12312;
        temperatureModule.drawProgressBar(number);
    },

    drawProgressBar: function(sensorTemperature){
        let temperature =sensorTemperature.toFixed(2);

        if(temperature <= 20 && temperature >= 18){
            let absValue = 18-temperature;
            let gradientColor = Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} ${gradientColor}%,${temperatureModule.config.$cool_gray} 0 28.56%, ${temperatureModule.config.$slightly_cool_gray} 0 42.84%, ${temperatureModule.config.$neutral_gray} 0 57.12%, ${temperatureModule.config.$slightly_warm_gray
            } 0 71.4%, ${temperatureModule.config.$warm_gray} 0 85.68%, ${temperatureModule.config.$hot_gray} 0 100%)`);
        }
        if(temperature >= 20 && temperature <=22){
            let absValue = 20-temperature;
            let gradientColor = 14.28 + Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%,${temperatureModule.config.$cool} 0 ${gradientColor}%, ${temperatureModule.config.$slightly_cool_gray} 0 42.84%, ${temperatureModule.config.$neutral_gray} 0 57.12%, ${temperatureModule.config.$slightly_warm_gray
            } 0 71.4%, ${temperatureModule.config.$warm_gray} 0 85.68%, ${temperatureModule.config.$hot_gray} 0 100%)`);
        }
        if(temperature >= 22 && temperature <=24){
            let absValue = 22-temperature;
            let gradientColor =28.56 +  Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%, ${temperatureModule.config.$cool} 0 28.56%, ${temperatureModule.config.$slightly_cool} 0 ${gradientColor}%, ${temperatureModule.config.$neutral_gray} 0 57.12%, ${temperatureModule.config.$slightly_warm_gray} 0 71.4%, ${temperatureModule.config.$warm_gray} 0 85.68%, ${temperatureModule.config.$hot_gray} 0 100%)`);
        }
        if(temperature >= 24 && temperature <=26){
            let absValue = 24-temperature;
            let gradientColor = 42.84 +  Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%, ${temperatureModule.config.$cool} 0 28.56%, ${temperatureModule.config.$slightly_cool} 0 42.84%, ${temperatureModule.config.$neutral} 0 ${gradientColor}%, ${temperatureModule.config.$slightly_warm_gray} 0 71.4%, ${temperatureModule.config.$warm_gray} 0 85.68%, ${temperatureModule.config.$hot_gray} 0 100%)`);
        }
        if(temperature >= 26 && temperature <=28){
            let absValue = 26-temperature;
            let gradientColor =57.12 + Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%, ${temperatureModule.config.$cool} 0 28.56%, ${temperatureModule.config.$slightly_cool} 0 42.84%, ${temperatureModule.config.$neutral} 0 57.12%, ${temperatureModule.config.$slightly_warm} 0 ${gradientColor}%, ${temperatureModule.config.$warm_gray} 0 85.68%, ${temperatureModule.config.$hot_gray} 0 100%)`);

        }
        if(temperature >= 28 && temperature <=30){
            let absValue = 28-temperature;
            let gradientColor =71.4 + Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%, ${temperatureModule.config.$cool} 0 28.56%, ${temperatureModule.config.$slightly_cool} 0 42.84%, ${temperatureModule.config.$neutral} 0 57.12%, ${temperatureModule.config.$slightly_warm} 0 71.4%, ${temperatureModule.config.$warm} 0 ${gradientColor}%, ${temperatureModule.config.$hot_gray} 0 100%)`);

        }
        if(temperature >= 30 && temperature <=32){
            let absValue = 30-temperature;
            let gradientColor =85.68 + Math.abs(7.14*absValue);
            temperatureModule.config.$temperatureContainer.text(`${temperature} °C`);
            temperatureModule.config.$progressBar.css('background',`conic-gradient(${temperatureModule.config.$cold} 14.28%, ${temperatureModule.config.$cool} 0 28.56%, ${temperatureModule.config.$slightly_cool} 0 42.84%, ${temperatureModule.config.$neutral} 0 57.12%, ${temperatureModule.config.$slightly_warm} 0 71.4%, ${temperatureModule.config.$warm} 0 85.68%,${temperatureModule.config.$hot} 0 ${gradientColor}%, ${temperatureModule.config.$hot_gray} 0 90%)`);
        }
    },

    connect: function(){
        // when connection is established
        temperatureModule.config.connection.on( 'connect', () => {
            temperatureModule.config.isConnectionActive = true;
        } );
    },

    disconnect: function(){
        temperatureModule.config.connection.on( 'disconnect', () => {
            temperatureModule.config.isConnectionActive = false;
        } );
    }
}

$(document).ready(function() {
    temperatureModule.init();
    temperatureModule.connect();
    temperatureModule.disconnect();
    temperatureModule.getTemperature();
});
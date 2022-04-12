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

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
        cameraModule.emitLeftEvent();
        cameraModule.emitRightEvent();
        cameraModule.emitUpEvent();
        cameraModule.emitDownEvent();

        cameraModule.config.$moveUpCameraButton.on('click',function(){
            cameraModule.emitUpEvent();
        });
        cameraModule.config.$moveDownCameraButton.on('click',function(){
            cameraModule.emitDownEvent();
        });
        cameraModule.config.$moveRightCameraButton.on('click',function(){
            cameraModule.emitRightEvent();
        });
        cameraModule.config.$moveLeftCameraButton.on('click',function(){
            cameraModule.emitLeftEvent();
        });


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
            const hasStartCameraClass = cameraModule.config.$toggleStreamButton.hasClass('start-camera');
            cameraModule.config.$toggleStreamButton.toggleClass("stop-camera start-camera");

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasStartCameraClass ? false : true);
            cameraModule.config.$toggleRecordingButton.attr("disabled", hasStartCameraClass ? false : true);

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
    },

    emitLeftEvent: function(){
        cameraModule.config.connection.emit( 'moveServoLeft' );
    },

    emitRightEvent: function(){
        cameraModule.config.connection.emit( 'moveServoRight' );
    },

    emitUpEvent: function(){
        cameraModule.config.connection.emit( 'moveServoUp' );
    },

    emitDownEvent: function(){
        cameraModule.config.connection.emit( 'moveServoDown' );
    }

};

cameraModule.init();
cameraModule.refresh();
cameraModule.toggleCapture();
cameraModule.toggleVideoStream();

const co2Module={
    init: function (){
        co2Module.config = {
            $smokeContainer: $(".js-CO2-progress-bar"),
            $smokeLoading: $(".js-loading-CO"),
            $progressBar: $(".progress-bar-CO2__background"),

            //colors
            //Temperature colors
            $low: '#4ac687',
            $mid: '#ffc001',
            $high: '#f54454',
            $dangerous: '#ff0000',

            //gray colors
            $low_gray: '#ababab',
            $mid_gray: '#9c9c9c',
            $high_gray: '#949494',
            $dangerous_gray: '#8c8c8c',

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
    },

    getSmoke: function(){
        co2Module.config.connection.on( 'mq135Event', (data) => {
            if(data.CO !== ' '){
                co2Module.config.$smokeLoading.hide();
                co2Module.drawProgressBar(data.CO);
            }
        } );
    },

    drawProgressBar: function(sensorSmoke){
        co2Module.config.$smokeLoading.hide();
        let smoke = Number(sensorSmoke * 100).toFixed(2);

        if(smoke <= 1000){
            let gradientColor = Math.abs(0.025 * smoke);
            co2Module.config.$smokeContainer.text(`${smoke} ppm`);
            co2Module.config.$progressBar.css('background',`conic-gradient(${co2Module.config.$low} ${gradientColor}%,${co2Module.config.$mid_gray} 0 50%, ${co2Module.config.$high_gray} 0 75%, ${co2Module.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke > 1000 && smoke < 5000){
            let gradientColor = Math.abs(0.00625 * (smoke-1000) + 25);
            console.log(gradientColor);
            co2Module.config.$smokeContainer.text(`${smoke} ppm`);
            co2Module.config.$progressBar.css('background',`conic-gradient(${co2Module.config.$low} 25%,${co2Module.config.$mid} 0 ${gradientColor}%, ${co2Module.config.$high_gray} 0 75%, ${co2Module.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke >=5000 && smoke < 40000){
            let gradientColor = Math.abs(0.00071429 * (smoke-5000) + 50);
            co2Module.config.$smokeContainer.text(`${smoke} ppm`);
            co2Module.config.$progressBar.css('background',`conic-gradient(${co2Module.config.$low} 25%,${co2Module.config.$mid} 0 50%, ${co2Module.config.$high} 0 ${gradientColor}%, ${co2Module.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke >=40000 && smoke <= 80000){
            let gradientColor = Math.abs(0.000625 * (smoke-40000) + 75);
            console.log(gradientColor);
            co2Module.config.$smokeContainer.text(`${smoke} ppm`);
            co2Module.config.$progressBar.css('background',`conic-gradient(${co2Module.config.$low} 25%,${co2Module.config.$mid} 0 50%, ${co2Module.config.$high} 0 75%, ${co2Module.config.$dangerous} 0 ${gradientColor}%, ${co2Module.config.$dangerous_gray} 0 90%)`);
        }
    },

    connect: function(){
        // when connection is established
        co2Module.config.connection.on( 'connect', () => {
            co2Module.config.isConnectionActive = true;
        } );
    },

    disconnect: function(){
        co2Module.config.connection.on( 'disconnect', () => {
            co2Module.config.isConnectionActive = false;
        } );
    }
}

$(document).ready(function() {
    co2Module.init();
    // co2Module.connect();
    // co2Module.disconnect();
    co2Module.getSmoke();
});

const connectionIp='192.168.0.116:9000';


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
            connection: io('192.168.0.116:9000'),
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
                humidityModule.drawHumidity(data.humidity);
            }
        } );
        // let number = 32.12312;
        // humidityModule.drawHumidity(number);
    },

    drawHumidity: function(sensorHumidity){
        let humidity = sensorHumidity;
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
// var addRgbButton = document.getElementById('change-rgb');
// var leftButton = document.getElementById('left');
// var rightButton = document.getElementById('right');
// var upButton = document.getElementById('up');
// var downButton = document.getElementById('down');

// initial button states
var button_red_state = false;
var button_green_state = false;
var button_blue_state = false;

// check for active connection
// var isConnectionActive = false;
//
//
// // connect to the Web Socket server
// var connection = io( '192.168.0.122:9000' );
//
// // when connection is established
// connection.on( 'connect', () => {
//   isConnectionActive = true;
// } );
//
// connection.on( 'disconnect', () => {
//   isConnectionActive = false;
// } );
//
// connection.on( 'motionSensorEvent', (data) => {
//   document.getElementById('motionData').innerHTML="Detectie senzor PIR: " + data.isActivated;
//   console.log(data);
// } );
//
//
// connection.on( 'sht21Event', (data) => {
//   document.getElementById('temperatureData').innerHTML="Temperatura: " + data.temperature + ' gradC';
//   document.getElementById('humidityData').innerHTML="Umiditate: " + data.humidity + ' %';
//   console.log(data);
// } );
//
// connection.on( 'mq135Event', (data) => {
//   document.getElementById('COData').innerHTML="CO: " + data.C0 + ' ppm';
//   document.getElementById('CO2Data').innerHTML="CO2: " + data.Smoke + ' ppm';
//   document.getElementById('alarmData').innerHTML="Alarm: " + data.isAlarmOn;
//   console.log(data);
// } );

// WebSocket event emitter function
var emitEvent = function( event ) {
  var redValue = document.getElementById('red-input').value;
var greenValue = document.getElementById('green-input').value;
var blueValue = document.getElementById('blue-input').value;

  // if( ! isConnectionActive ) {
  //   return alert( 'Server connection is closed!' );
  // }

  // change button state
  // if( event.target.id === 'button-red') { button_red_state = ! button_red_state; }
  // if( event.target.id === 'button-green') { button_green_state = ! button_green_state; }
  // if( event.target.id === 'button-blue') { button_blue_state = ! button_blue_state; }

  // emit `led-toggle` socket event
  // connection.emit( 'led-toggle', {
  //   'red': redValue,
  //   'green': greenValue,
  //   'blue': blueValue
  // } );

};

// var emitLeftEvent = function( event ) {
//   connection.emit( 'moveServoLeft' );
// };
//
//
// var emitRightEvent = function( event ) {
//   connection.emit( 'moveServoRight');
// };
//
// var emitUpEvent = function( event ) {
//   connection.emit( 'moveServoUp');
// };
//
// var emitDownEvent = function( event ) {
//   connection.emit( 'moveServoDown');
// };



// leftButton.addEventListener( 'click' , emitLeftEvent);
// rightButton.addEventListener( 'click' , emitRightEvent);
// upButton.addEventListener( 'click' , emitUpEvent);
// downButton.addEventListener( 'click' , emitDownEvent);

const smokeModule={
    init: function (){
        smokeModule.config = {
            $smokeContainer: $(".js-smoke-progress-bar"),
            $smokeLoading: $(".js-loading-smoke"),
            $progressBar: $(".progress-bar-smoke__background"),

            //colors
            //Temperature colors
            $low: '#4ac687',
            $mid: '#ffc001',
            $high: '#f54454',
            $dangerous: '#ff0000',

            //gray colors
            $low_gray: '#ababab',
            $mid_gray: '#9c9c9c',
            $high_gray: '#949494',
            $dangerous_gray: '#8c8c8c',

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
    },

    getSmoke: function(){
        smokeModule.config.connection.on( 'mq135Event', (data) => {
            if(data.Smoke !== ' '){
                smokeModule.config.$smokeLoading.hide();
                smokeModule.drawProgressBar(data.Smoke);
            }
        } );
    },

    drawProgressBar: function(sensorSmoke){
        smokeModule.config.$smokeLoading.hide();
        //             smokeModule.drawProgressBar(data.Smoke);
        let smoke =Number(sensorSmoke).toFixed(2);

        if(smoke <= 50){
            let gradientColor = Math.abs(0.5 * smoke);
            smokeModule.config.$smokeContainer.text(`${smoke} ppm`);
            smokeModule.config.$progressBar.css('background',`conic-gradient(${smokeModule.config.$low} ${gradientColor}%,${smokeModule.config.$mid_gray} 0 50%, ${smokeModule.config.$high_gray} 0 75%, ${smokeModule.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke > 50 && smoke < 100){
            let gradientColor = Math.abs(0.5 * (smoke-100) + 50);
            smokeModule.config.$smokeContainer.text(`${smoke} ppm`);
            smokeModule.config.$progressBar.css('background',`conic-gradient(${smokeModule.config.$low} 25%,${smokeModule.config.$mid} 0 ${gradientColor}%, ${smokeModule.config.$high_gray} 0 75%, ${smokeModule.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke >=100 && smoke < 150){
            let gradientColor = Math.abs(0.5 * (smoke-100) + 50);
            smokeModule.config.$smokeContainer.text(`${smoke} ppm`);
            smokeModule.config.$progressBar.css('background',`conic-gradient(${smokeModule.config.$low} 25%,${smokeModule.config.$mid} 0 50%, ${smokeModule.config.$high} 0 ${gradientColor}%, ${smokeModule.config.$dangerous_gray} 0 100%)`);
        }
        if(smoke >=150 && smoke <= 200){
            let gradientColor = Math.abs(0.5 * (smoke-150) + 75);
            console.log(gradientColor);
            smokeModule.config.$smokeContainer.text(`${smoke} ppm`);
            smokeModule.config.$progressBar.css('background',`conic-gradient(${smokeModule.config.$low} 25%,${smokeModule.config.$mid} 0 50%, ${smokeModule.config.$high} 0 75%, ${smokeModule.config.$dangerous} 0 ${gradientColor}%, ${smokeModule.config.$dangerous_gray} 0 90%)`);
        }
    },

    connect: function(){
        // when connection is established
        smokeModule.config.connection.on( 'connect', () => {
            smokeModule.config.isConnectionActive = true;
        } );
    },

    disconnect: function(){
        smokeModule.config.connection.on( 'disconnect', () => {
            smokeModule.config.isConnectionActive = false;
        } );
    }
}

$(document).ready(function() {
    smokeModule.init();
    smokeModule.connect();
    smokeModule.disconnect();
    smokeModule.getSmoke();
    //smokeModule.drawProgressBar(0.123);
});

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
            connection: io('192.168.0.116:9000'),
        }
    },

    getTemperature: function(){
        temperatureModule.config.connection.on( 'sht21Event', (data) => {
            if(data.temperature !== ' '){
                temperatureModule.config.$temperatureLoading.hide();
                temperatureModule.drawProgressBar(data.temperature);
            }
        } );
    },

    drawProgressBar: function(sensorTemperature){
        let temperature =sensorTemperature;

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


const weatherModule = {
    init: function(){
        weatherModule.config = {
            //APIS
            openweathermapAPIkey : 'c121fc1e9e9a3715be9209990ec369fe',
            openCageAPIkey : '711c832fc0a34b7f8852d5c597b3b49a',

            $tempValueCurrent : $('.js-current-temp-value'),

            numberOfFutereDaysTemperatyre : 6,

            //icons id
            $weather_icon_current_day : $('.js-current-day-weather-icon'),

            //days
            days : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            //icons
            thermoterIcon : "<i class='fas fa-temperature-high'></i>",
            humidityIcon : "<i class='fas fa-tint'></i>",
            windIcon : "<i class='fas fa-wind'></i>"
        }
    },
    getCoordinates : function(){
        navigator.geolocation.getCurrentPosition(position => {
            const latValue = position.coords.latitude;
            const longValue = position.coords.longitude;

            const getWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latValue}&lon=${longValue}&exclude=hourly&appid=${weatherModule.config.openweathermapAPIkey}`;
            const getStreetUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latValue},${longValue}&pretty=1&key=${weatherModule.config.openCageAPIkey}`;

            fetch(getWeatherUrl)
                .then(response => response.json())
                .then(data => {
                    const iconId = data.current.weather[0].icon;
                    const temperatureValue = (data.current.temp - 273.15).toFixed(2);

                    //Append thermoterIcon and temperature value for current temperature
                    weatherModule.config.$tempValueCurrent.append(weatherModule.config.thermoterIcon);
                    weatherModule.config.$tempValueCurrent.append(`<span>&nbsp${temperatureValue}&nbsp°C</span>`);

                    //set icons for temperature
                    weatherModule.config.$weather_icon_current_day.attr('src',`https://openweathermap.org/img/wn/${iconId}@2x.png`);

                    //Append weather component for next 3 days
                    weatherModule.appendWeatherComponent(weatherModule.config.numberOfFutereDaysTemperatyre, data);

                    // return fetch(getStreetUrl)cd ../
                    //     .then(response => response.json())
                    //     .then(data => {
                    //         const county = data.results[0].components.county;
                    //         const street = data.results[0].components.road;
                    //         $(".weather__street").text(street);
                    //         $('.weather__county').text(county);
                    //     })
                });
        })
    },

    generateNextDays : function (numberOfDays){
        let days = [];

        let myCurrentDate=new Date();
        let myFutureDate=new Date(myCurrentDate);

        for(let i=0;i<numberOfDays; i++){
            myFutureDate.setDate(myFutureDate.getDate()+1);
            days.push(weatherModule.config.days[myFutureDate.getDay()]);
        }

        return days;
    },

    appendWeatherComponent : function(numberofDays, data){
        let weatherApp = $("<div class='col-lg-2 col-xl-4 d-flex flex-column justify-content-center align-items-center'>");
        let nextDays = weatherModule.generateNextDays(weatherModule.config.numberOfFutereDaysTemperatyre);

        for(let i=0; i < numberofDays; i++){
            weatherApp.append(`<div class='weather__day'>${nextDays[i]}</div>`);
            weatherApp.append(`<img class='js-first-day-weather-icon' src='https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png' style="height: 100px; width: 100px" alt='wheater-icon' />`)
            console.log(weatherModule.config.numberOfFutereDaysTemperatyre);
            let dataComponent = $(`<div class='weather__values d-flex flex-column align-items-start'></div>`);
            let weatherValue = $(`<div class='weather__temperature-value'></div>`);

            weatherValue.append(weatherModule.config.thermoterIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].temp.max - 273.15).toFixed(0))}-${Math.round((data.daily[i].temp.min - 273.15).toFixed(0))}&nbsp°C</span>`);

            dataComponent.append(weatherValue);

            weatherValue = $(`<div class='weather__humidity-value'></div>`);

            weatherValue.append(weatherModule.config.humidityIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].humidity).toFixed(0))}&nbsp%</span>`);

            dataComponent.append(weatherValue);

            weatherValue = $(`<div class='weather__wind-value'></div>`);

            weatherValue.append(weatherModule.config.windIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].humidity).toFixed(0))}&nbsp%</span>`);

            dataComponent.append(weatherValue);

            weatherApp.append(dataComponent);
            $(".js-weather-container").append(weatherApp);
            weatherApp = $(`<div class='col-lg-2 col-xl-4 d-flex ${i > 1 ? 'd-md-flex d-none d-xl-none d-sm-none' : ''} flex-column justify-content-center align-items-center'>`);
        }
    }
}

$(document).ready(function() {
    weatherModule.init();
    weatherModule.getCoordinates();
});
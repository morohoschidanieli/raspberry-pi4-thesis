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
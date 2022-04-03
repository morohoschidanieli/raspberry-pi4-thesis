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
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
            if(data.C0 !== ' '){
                co2Module.config.$smokeLoading.hide();
                co2Module.drawProgressBar(data.C0);
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
    co2Module.connect();
    co2Module.disconnect();
    co2Module.getSmoke();
});
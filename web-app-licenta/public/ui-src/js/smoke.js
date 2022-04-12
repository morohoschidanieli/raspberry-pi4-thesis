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
const motionDetectionModule={
    init: function (){
        motionDetectionModule.config = {
            $loadingMotion: $(".js-loading-motion"),
            $motionDetectionBackground: $(".js-motion-background"),

            //colors
            //Temperature colors
            $activated: 'red',
            $deactivated: 'green',

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
    },

    getStateOfMotionSensor: function(){
        motionDetectionModule.config.connection.on( 'motionSensorEvent', (data) => {
            if(data.isActivated !== ''){
                motionDetectionModule.changeMotionState(data.isActivated);
            }
        } );
    },

    changeMotionState: function(isMotionSensorOn){
        // motionDetectionModule.config.$loadingMotion.addClass("d-none");
        motionDetectionModule.config.$loadingMotion.css({'height':'70px'});
        const isObjectDetected = isMotionSensorOn === 'false';

        if(isObjectDetected){
            motionDetectionModule.config.$loadingMotion.attr('src','/assets/img/motion-sensor/motion-sensor.svg')
            motionDetectionModule.config.$motionDetectionBackground.css({"border-color": motionDetectionModule.config.$activated});
        }else{
            motionDetectionModule.config.$loadingMotion.attr('src','/assets/img/motion-sensor/motion-sensor-off.svg')
            motionDetectionModule.config.$motionDetectionBackground.css({"border-color": motionDetectionModule.config.$deactivated});
        }
    },

    connect: function(){
        // when connection is established
        smokeAlarmModule.config.connection.on( 'connect', () => {
            smokeAlarmModule.config.isConnectionActive = true;
        } );
    },

    disconnect: function(){
        smokeAlarmModule.config.connection.on( 'disconnect', () => {
            smokeAlarmModule.config.isConnectionActive = false;
        } );
    }
}

$(document).ready(function() {
    motionDetectionModule.init();
    // co2Module.connect();
    // co2Module.disconnect();
    motionDetectionModule.getStateOfMotionSensor();
});
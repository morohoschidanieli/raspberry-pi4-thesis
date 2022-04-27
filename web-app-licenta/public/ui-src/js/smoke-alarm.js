const smokeAlarmModule={
    init: function (){
        smokeAlarmModule.config = {
            $smokeContainer: $(".js-smoke-alarm"),
            $alarmBackground: $(".js-alarm-background"),

            //colors
            //Temperature colors
            $activated: 'red',
            $deactivated: 'green',

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
    },

    getStateOfSmokeAlarm: function(){
        smokeAlarmModule.config.connection.on( 'mq135Event', (data) => {
            if(data.isAlarmOn !== ''){
                smokeAlarmModule.config.$smokeContainer.addClass("d-none");
                smokeAlarmModule.changeAlarmState(data.isAlarmOn);
            }
        } );
    },

    changeAlarmState: function(sensorSmokeAlarm){
        const isAlarmStarted = sensorSmokeAlarm === 'true';

        if(isAlarmStarted){
            smokeAlarmModule.config.$alarmBackground.css({"background-color": smokeAlarmModule.config.$activated});
        }else{
            smokeAlarmModule.config.$alarmBackground.css({"background-color": smokeAlarmModule.config.$deactivated});
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
    smokeAlarmModule.init();
    // co2Module.connect();
    // co2Module.disconnect();
    smokeAlarmModule.getStateOfSmokeAlarm();
});
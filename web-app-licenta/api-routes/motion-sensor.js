//motion-sensor.js
const { pathDatabase } = require( '../secrets/firebase/admin.js' );

module.exports = function(app, io){
   
    app.post('/motion-sensor-data', (req, res) => {
        let motionSensorData = req.body;
        console.log(motionSensorData);
        io.emit('motionSensorEvent',{"isActivated":motionSensorData.isActivated});
        res.send("Data received");
      });
}
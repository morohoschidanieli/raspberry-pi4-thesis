//rgb.js
const { pathDatabase } = require( '../secrets/firebase/admin.js' );

module.exports = function(app, io){
    app.post('/rgb-data', (req, res) => {
        let rgbData = (req.body);

        const previousData = pathDatabase.child(`sensors/rgb-data`);
        previousData.set({
          red: rgbData.red,
          green : rgbData.green,
          blue :  rgbData.blue
        })
  
        //io.emit('motionSensorEvent',{"isActivated":motionSensorData.isActivated});
        res.redirect('/');
      });
}
//rgb.js
const { pathDatabase } = require( '../secrets/firebase/admin.js' );

module.exports = function(app, io){
    app.post('/rgb-data', (req, res) => {
        let rgbData = (req.body.favcolor);
        const r = parseInt(rgbData.substr(1,2), 16);
        const g = parseInt(rgbData.substr(3,2), 16);
        const b = parseInt(rgbData.substr(5,2), 16);
        const previousData = pathDatabase.child(`sensors/rgb-data`);
        previousData.set({
          red: r,
          green : g,
          blue :  b
        })
  
        //io.emit('motionSensorEvent',{"isActivated":motionSensorData.isActivated});
        res.redirect('/');
      });
}
//smoke.js
const { pathDatabase } = require( '../secrets/firebase/admin.js' );

module.exports = function(app, io){

    app.post('/get-smoke-data', (req, res) => {
        let mq135Data = req.body;
        
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
      
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
      
        if(seconds < 10){
            seconds ='0' + seconds;
        }
        if(minutes < 10){
            minutes ='0' + minutes;
        }
        if(hours < 10){
            hours ='0' + hours;
        }
        
        const currentTime = hours + ':' + minutes;
        const currentDate = month + '-' + date + '-' + year;
      
        const previousData = pathDatabase.child(`sensors/smoke/${currentDate}/${currentTime}`);
      
        if(minutes == '00'){
          previousData.set({
            CO: mq135Data.C0,
            CO2 : mq135Data.Smoke
          })
        }
        console.log(mq135Data);
        io.emit('mq135Event',mq135Data);
        res.send("Data received");
      });
}
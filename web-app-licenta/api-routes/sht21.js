//sht21.js
const { pathDatabase } = require( '../secrets/firebase/admin.js' );

module.exports = function(app, io){
    app.post('/get-temperature-data', (req, res) => {
        let sht21Data = req.body;
      
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
      
        const previousData = pathDatabase.child(`sensors/temperature-and-humidity/${currentDate}/${currentTime}`);
      
        if(minutes == '00'){
          previousData.set({
            temperature: sht21Data.temperature,
            humidity : sht21Data.humidity
          })
        }
        console.log(sht21Data);
        io.emit('sht21Event',sht21Data);
        res.send("Data received");
      });
}
module.exports = function () { 
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
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

    return {'hours': hours,
            'minutes' : minutes,
            'seconds' : seconds};
};
const weatherModule = {
    init: function(){
        weatherModule.config = {
            //APIS
            openweathermapAPIkey : 'c121fc1e9e9a3715be9209990ec369fe',
            openCageAPIkey : '711c832fc0a34b7f8852d5c597b3b49a',

            $tempValueCurrent : $('.js-current-temp-value'),

            numberOfFutereDaysTemperatyre : 4,

            //icons id
            $weather_icon_current_day : $('.js-current-day-weather-icon'),

            //days
            days : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            //icons
            thermoterIcon : "<i class='fas fa-temperature-high'></i>",
            humidityIcon : "<i class='fas fa-tint'></i>",
            windIcon : "<i class='fas fa-wind'></i>"
        }
    },
    getCoordinates : function(){
        navigator.geolocation.getCurrentPosition(position => {
            const latValue = position.coords.latitude;
            const longValue = position.coords.longitude;

            const getWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latValue}&lon=${longValue}&exclude=hourly&appid=${weatherModule.config.openweathermapAPIkey}`;
            const getStreetUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latValue},${longValue}&pretty=1&key=${weatherModule.config.openCageAPIkey}`;

            fetch(getWeatherUrl)
                .then(response => response.json())
                .then(data => {
                    const iconId = data.current.weather[0].icon;
                    const temperatureValue = (data.current.temp - 273.15).toFixed(2);

                    //Append thermoterIcon and temperature value for current temperature
                    weatherModule.config.$tempValueCurrent.append(weatherModule.config.thermoterIcon);
                    weatherModule.config.$tempValueCurrent.append(`<span>&nbsp${temperatureValue}&nbsp°C</span>`);

                    //set icons for temperature
                    weatherModule.config.$weather_icon_current_day.attr('src',`https://openweathermap.org/img/wn/${iconId}@2x.png`);

                    //Append weather component for next 3 days
                    weatherModule.appendWeatherComponent(3, data);

                    // return fetch(getStreetUrl)
                    //     .then(response => response.json())
                    //     .then(data => {
                    //         const county = data.results[0].components.county;
                    //         const street = data.results[0].components.road;
                    //         $(".weather__street").text(street);
                    //         $('.weather__county').text(county);
                    //     })
                });
        })
    },

    generateNextDays : function (numberOfDays){
        let days = [];

        let myCurrentDate=new Date();
        let myFutureDate=new Date(myCurrentDate);

        for(let i=0;i<numberOfDays; i++){
            myFutureDate.setDate(myFutureDate.getDate()+1);
            days.push(weatherModule.config.days[myFutureDate.getDay()]);
        }

        return days;
    },

    appendWeatherComponent : function(numberofDays, data){
        let weatherApp = $("<div class='col-4 d-flex flex-column justify-content-center align-items-center'>");
        let nextDays = weatherModule.generateNextDays(weatherModule.config.numberOfFutereDaysTemperatyre);

        for(let i=0; i < numberofDays; i++){
            weatherApp.append(`<div class='weather__day'>${nextDays[i]}</div>`);
            weatherApp.append(`<img class='js-first-day-weather-icon' src='https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png' style="height: 100px; width: 100px" alt='wheater-icon' />`)

            let dataComponent = $(`<div class='weather__values d-flex flex-column align-items-start'></div>`);
            let weatherValue = $(`<div class='weather__temperature-value'></div>`);

            weatherValue.append(weatherModule.config.thermoterIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].temp.max - 273.15).toFixed(0))}-${Math.round((data.daily[i].temp.min - 273.15).toFixed(0))}&nbsp°C</span>`);

            dataComponent.append(weatherValue);

            weatherValue = $(`<div class='weather__humidity-value'></div>`);

            weatherValue.append(weatherModule.config.humidityIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].humidity).toFixed(0))}&nbsp%</span>`);

            dataComponent.append(weatherValue);

            weatherValue = $(`<div class='weather__wind-value'></div>`);

            weatherValue.append(weatherModule.config.windIcon);
            weatherValue.append(`<span>&nbsp${Math.round((data.daily[i].humidity).toFixed(0))}&nbsp%</span>`);

            dataComponent.append(weatherValue);

            weatherApp.append(dataComponent);
            $(".js-weather-container").append(weatherApp);
            weatherApp = $("<div class='col-4 d-flex flex-column justify-content-center align-items-center'>");
        }
    }
}

$(document).ready(function() {
    weatherModule.init();
    weatherModule.getCoordinates();
});
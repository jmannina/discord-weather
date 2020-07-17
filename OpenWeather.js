

const token = require('./config.json')
const got = require('got');

function CelciusToFarenheit(celcius){
    return (celcius *  (9/5) + 32).toFixed(0);
};




var OpenWeather = {
    //takes in lattitude and longitude and returns the weather for the current day.
    getDay: async function getDay(latt, long) {
        try {
            const response = await got(`https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&units=metric&exclude=hourly,minutely,daily&appid=${token.weather_token}`);
            const test = (response.body);
            const object = JSON.parse(test);
            const celcius = (object['current']['temp']).toFixed(0);
            const farenheit = CelciusToFarenheit(celcius);
            const conditions = object['current']['weather'][0]['description'];
            const feelsCelcius = object['current']['feels_like'].toFixed(0);
            const feelsFarenheit = CelciusToFarenheit(feelsCelcius);
            const humidity = object['current']['humidity'];
            const icon = object['current']['weather'][0]['icon'];
            const imageSource = `http://openweathermap.org/img/wn/${icon}@2x.png`;



            const result = {currentTemp: [celcius,farenheit], feelsLike: [feelsCelcius, feelsFarenheit], condition: conditions, humidity: humidity, image: imageSource};
            return result;
            
        } catch (error) {
            console.log(error);
        }
    },

    // takes in lattitude and longitude for location and returns a weatheer 
    getWeek: async function getWeek(latt, long){
        var result = [];
        try{
            const response = await got(`https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&units=metric&exclude=hourly,minutely&appid=${token.weather_token}`);
            const weather = JSON.parse(response.body);
            
    
            for(var day = 0; day < 5 ; day++){
                var celcius = (weather['daily'][day]["temp"]["day"]).toFixed(0);
                var fareheit = CelciusToFarenheit(celcius);
                var icon = weather['daily'][day]["weather"][0]["icon"];
                var description = weather['daily'][day]["weather"][0]["description"];
                const imageSource = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                var dayResult =  {temp: [celcius, fareheit], image: imageSource, description: description};
                result.push(dayResult);
            }

        }
        catch (error) {
            console.log(error);
            result = 'Oh no - something went wrong :(';
        }

        return result;

    }

}



module.exports = OpenWeather;


// sunrise, sunset, teeemp, feels like,


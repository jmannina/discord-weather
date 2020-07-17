//Joseph Mannina
//07.11.2020
//added comment

//discord bot key that is used to log into client
// discord library
const Discord = require('discord.js');

const token = require('./config.json')
// coordinate mapping api
var OpenCageGeo = require('./OpenCageGeo.js');
// weather api
var OpenWeather = require('./OpenWeather.js');
// initialize client
const client = new Discord.Client();

//prefix to command request. ex: !weather
const prefix = "!"

const PORT = process.env.PORT || 3000;

//starts up the discord bot
client.once('ready', () => {
    console.log('Weather bot is ready');
})

// handles the commands
client.on('message', msg => {

    // if the message doesnt start with the prefix (see above) or the author is another bot
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    // seperates the args[] and command
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    // !weather
    if (command === 'weather'){
        
        // no arguments
        if (!args.length){
            
        }
        // !weather week
        else if (args[0] === 'week'){
            
            SendMessage(OpenWeather.getWeek,createWeekResponse,args,msg);
        }
        // !weather day
        else if (args[0] === 'day'){
            SendMessage(OpenWeather.getDay,createDayResponse,args,msg);
        }
        // !weather help
        else if(args[0] === "help"){
            const helpMessage = new Discord.MessageEmbed()
            .setColor('#ec6b4b')
            .setTitle(`Currently Supported Commands:`)
            .addFields(
                {name: "!weather day [zipcode or city name]", value: `returns the current forcast for the specified location`},
                {name: "!weather week [zipcode or city name]", value: `returns the forcast of the week for the specified location`},
                {name: "!weather help", value: `returns the list of all available commands`},
                {name: "!weather request", value: "returns the contact information to report a bug or submit a enhancement request"},
            );
            msg.channel.send(helpMessage);
        }
        // !weather request
        else if(args[0] === "request"){
            const requestMessage = new Discord.MessageEmbed()
            .setColor('#ec6b4b')
            .setTitle(`simplyy#2347 on discord to report bugs and request features`)
            msg.channel.send(requestMessage);
        }
    }   
});

//bot will login to discord

client.login(token.discord_token).then(() => {client.user.setActivity("Forcasting")});



//takes in location -> converts location to coordinates -> retrieves the weather for location -> creates embeded message -> sends message

function SendMessage(getType, ResponseType, arguments, msg){
    arguments.shift();
    var location = arguments.toString().replace(",", " ");
    OpenCageGeo.getGeoTag(arguments).then(function(geoResult){      
        getType(geoResult.coordinates[0], geoResult.coordinates[1]).then(function (weatherResult){
            ResponseType(weatherResult, location, geoResult).then(function (message){
                msg.channel.send(message);                    
            })
        })
    });
}

// creates the discord.js embeded message for a "!weather day [location]" request

async function createDayResponse(Weather, location, geo){
    const resultMessage = new Discord.MessageEmbed()
        .setColor('#ec6b4b')
        .setTitle(`Today's Forcast: ${location}`)
        .setURL(`https://www.google.com/maps/place/${geo.coordinates[0]}+${geo.coordinates[1]}`)
        .setThumbnail(Weather.image)
        .addFields(
            {name: "Current Temp:", value: `${Weather.currentTemp[1]}\u00B0 F | ${Weather.currentTemp[0]}\u00B0 C`},
            {name: "Conditions: ", value: `${Weather.condition}`},
            {name: "Feels Like:", value: `${Weather.feelsLike[1]}\u00B0 F | ${Weather.feelsLike[0]}\u00B0 C`, inline: true},
            { name: '\u200B', value: '\u200B', inline: true },
            {name: "Humidity: ", value: `${Weather.humidity}%`, inline: true}
        );
    return resultMessage;
}

// creates the discord.js embeded message for a "!weather week [location]" request.

async function createWeekResponse(Weather, location, geo){
    const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    var currentDay = new Date()
    var currentDay = currentDay.getDay();
    const day2 = `${Weather[1].temp[1]}\u00B0 F | ${Weather[1].temp[0]}\u00B0 C\n${Weather[1].description}`;
    const day3 = `**${dayList[currentDay + 2]}:**\n\n${Weather[2].temp[1]}\u00B0 F | ${Weather[2].temp[0]}\u00B0 C\n${Weather[2].description}`;
    const day4 = `**${dayList[currentDay + 3]}:**\n\n ${Weather[3].temp[1]}\u00B0 F | ${Weather[3].temp[0]}\u00B0 C\n${Weather[3].description}`;
    const day5 = `**${dayList[currentDay + 4]}:**\n\n ${Weather[4].temp[1]}\u00B0 F | ${Weather[4].temp[0]}\u00B0 C\n${Weather[4].description}`

    const completeMessage = new Discord.MessageEmbed()
        .setColor('#ec6b4b')
        .setTitle(`Weekly Forcast: ${location}`)
        .setThumbnail(`${Weather[0].image}`)
        .setURL(`https://www.google.com/maps/place/${geo.coordinates[0]}+${geo.coordinates[1]}`)
        .addFields(
            {name: `Today: `, value: `\u200b\n${Weather[0].temp[1]}\u00B0 F | ${Weather[0].temp[0]}\u00B0 C\n${Weather[0].description}\n\n${day3}\n\n${day5}`, inline: true},
            
        )
        .addFields(
            { name: `${dayList[currentDay + 1]}: `, value: `\u200b\n${day2}\n\n${day4}`, inline: true},
        )

    return completeMessage;
} 



const got = require('got');
const token = require('./config.json')



var OpenCageGeo = {
// recieves location (zipcode or city name) returns --> [lattitude, longitude]
getGeoTag: async function geoTag(location) {
    var city = '';
    var zipcode = '';

    try {
        const response = await got(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${token.location_token}`);
        const body = (response.body);
        const object = JSON.parse(body);
            const lattitude = object['results'][0]['geometry']['lat'];
            const Longitude = object['results'][0]['geometry']['lng'];      
            const result = {coordinates: [lattitude,Longitude]};         
        return result;
    } catch (error) {
        console.log(error);
    }
}

};


module.exports = OpenCageGeo;





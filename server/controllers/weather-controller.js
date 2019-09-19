// The modules
const http      = require("http");
const geoip     = require("geoip-lite");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.weather(function (res) {
    dbo = res;
});
// The models
const Weather = require("../models/weather/weather");
// The functions
function get(req, res, next) {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    let geo = geoip.lookup(ip);
    // Checks if it could find the city
    if (geo.city && geo.country) {
        let dte = new Date();
        let date = `${dte.getFullYear()}-${dte.getMonth()}-${dte.getDate()}-${dte.getHours()}`;
        getWeather(geo.city.toLowerCase(), date, geo.country.toLowerCase(), function (result) {
            res.json({
                status: true,
                weather: result
            });
        })
    } else {
        res.json({
            status: false
        })
    }
}
// Gets the weather function
function getWeather (city, date, lang, cb) {
    Weather.getWeather(dbo, city, date, lang, function (weather) {
        if (weather) {
            cb(weather);
        } else {
            http.get(`http://api.apixu.com/v1/forecast.json?key=8782f10e27c74944a02181622190609&q=${city}&lang=${lang}&days=5`, function (res) {
                let body = "";
                res.on("data", function (chunk) {
                    body += chunk;
                });
                res.on("end", function () {
                    let result = JSON.parse(body);
                    let weatherd = new Weather({
                        location: result.location,
                        current: result.current,
                        city: result.location.name.toLowerCase(),
                        date: date,
                        forecast: result.forecast,
                        lang: lang
                    });
                    weatherd.save(dbo, function (status) {
                        cb (status ? weatherd : false);
                    });
                });
            });
        }
    });
}
// Exports
module.exports = { get };
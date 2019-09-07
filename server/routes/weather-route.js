// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const WeatherController = require("../controllers/weather-controller");
// Handles the request
Router.post("/get", function (req, res, next) {
    WeatherController.get(req, res, next);
});
// Exports
module.exports = Router;
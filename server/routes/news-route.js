// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const NewsController = require("../controllers/news-controller");
// Handles the request
Router.post("/get-latest/:lang", function (req, res, next) {
    NewsController.getLatest(req, res, next);
});
Router.post("/search", function (req, res, next) {
    NewsController.search(req, res, next);
});
Router.post("/autocomplete", function (req, res, next) {
    NewsController.autocomplete(req, res, next);
})
// Exports
module.exports = Router;
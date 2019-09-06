// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const SearchController = require("../controllers/search-controller");
// Handles the request
Router.post("/default/:params", function (req, res, next) {
    SearchController.defaultsearch(req, res, next);
});
Router.post("/images/:params", function (req, res, next) {
    SearchController.imagesearch(req, res, next);
})
// Exports
module.exports = Router;
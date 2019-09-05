// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const SearchController = require("../controllers/search-controller");
// Handles the request
Router.post("/:params", function (req, res, next) {
    SearchController.search(req, res, next);
});
// Exports
module.exports = Router;
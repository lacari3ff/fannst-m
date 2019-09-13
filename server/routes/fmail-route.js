// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const FmailController = require("../controllers/flmail-controller");
// Handles the request
Router.post("/send", function (req, res, next) {
    FmailController.send(req, res, next);
});
// Exports
module.exports = Router;
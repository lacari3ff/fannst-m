// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const FmailController = require("../controllers/fmail-controller");
// Handles the request
Router.post("/send", function (req, res, next) {
    FmailController.send(req, res, next);
});
Router.post("/get-emails", function (req, res, next) {
    FmailController.getEmails(req, res, next);
});
// Exports
module.exports = Router;
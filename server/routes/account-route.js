// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const AccountController = require("../controllers/account-controller");
// Handles the request
Router.post("/get-latest-logs", function(req, res, next) {
  AccountController.getLatestLogs(req, res, next);
});
Router.post("/get-full-user", function(req, res, next) {
  AccountController.getFullUser(req, res, next);
});
// Exports
module.exports = Router;

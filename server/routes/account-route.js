// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const AccountController = require("../controllers/account-controller");
// Handles the request
Router.post("/get-latest-logs", function(req, res, next) {
  AccountController.signup(req, res, next);
});
// Exports
module.exports = Router;

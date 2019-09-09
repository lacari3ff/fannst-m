// The modules
const express = require("express");
// Initializes
const Router = express.Router();
// Controllers
const AuthController = require("../controllers/auth-controller");
// Handles the request
Router.post("/signup", function (req, res, next) {
    AuthController.signup(req, res, next);
});

Router.post("/signin", function (req, res, next) {
   AuthController.signin(req, res, next);
});
// Exports
module.exports = Router;
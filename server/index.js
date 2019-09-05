// Modules
const express = require("express");
const BodyParser = require("body-parser");
// Initalizes
const app = express();
app.use(BodyParser.urlencoded({
    extended: false
}));
// The Routes
//app.use("/rest/search")
// Listens
app.listen(80);
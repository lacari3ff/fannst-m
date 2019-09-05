// The modules
const mongoose      = require("mongoose");
const express       = require("express");
const cors          = require("cors");
const BodyParser    = require("body-parser");
// Connects mongoose
mongoose.connect("mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb", {
    useNewUrlParser: true,
    dbName: "fannst_index"
});
// Initializes
const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(BodyParser.urlencoded({
    extended: false
}));
// The Routes
const RestSearchRoute = require("./routes/rest-search");
app.use("/rest/search", RestSearchRoute);
// Listens
app.listen(80);
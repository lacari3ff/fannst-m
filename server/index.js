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
const SearchRoute       = require("./routes/search-route");
const WeatherRoute      = require("./routes/weather-route");
const NewsRoute         = require("./routes/news-route");
app.use("/rest/search", SearchRoute);
app.use("/rest/weather", WeatherRoute);
app.use("/rest/news", NewsRoute);
// Listens
app.listen(80);
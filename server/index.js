// The modules
const express       = require("express");
const cors          = require("cors");
const BodyParser    = require("body-parser");
const path          = require("path");
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
app.get("*", function (req, res, next) {
    let domain = req.hostname;

    switch(domain) {
        case "localhost": {
            res.sendFile(path.resolve(`${__dirname}/views/news/index.html`));
            break;
        }
        default: {
            break;
        }
    }
});
// Listens
app.listen(80);
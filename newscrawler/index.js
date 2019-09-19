// The modules
const fs            = require("fs");
const mongoose      = require("mongoose");
// Connects mongoose
mongoose.connect("mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb", {
    useNewUrlParser: true,
    dbName: "fannst_index"
});
// The sources
const crawl         = require("./src/crawl-newsfeed")
// Reads the config
const news_feeds    = JSON.parse(fs.readFileSync("./newsfeeds.json"));
// Parse the RSS Feeds
function entry () {
    crawl.full(news_feeds, function () {
        // Runs again after 8 minutes
        console.log("Running again in 15 minutes");
        setTimeout(function () {
            entry();
        }, 900000)
    });
}

entry();
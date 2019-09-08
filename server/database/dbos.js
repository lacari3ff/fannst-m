const MongoClient = require("mongodb").MongoClient;

let __GLOBAL_URI = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

function news (cb) {
    MongoClient.connect(__GLOBAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        cb (db.db("fannst_news"));
    });
}

function auth (cb) {
    MongoClient.connect(__GLOBAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        cb (db.db("fannst_auth"));
    });
}

function search (cb) {
    MongoClient.connect(__GLOBAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        cb (db.db("fannst_search"));
    });
}

function weather (cb) {
    MongoClient.connect(__GLOBAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, db) {
        cb (db.db("fannst_weather"));
    });
}

module.exports = { news, auth, search, weather };
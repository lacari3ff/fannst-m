// Modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Defines the Schema for the website cache
const websitecacheSchema = Schema({
    param: String,
    expire: Date,
    results: Array
});
// Exports
module.exports = mongoose.model("Websitecache", websitecacheSchema);
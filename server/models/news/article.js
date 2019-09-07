// The modules
const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
// Creates the Schema
const articleSchema = Schema({
    title: String,
    guid: String,
    isoDate: Date,
    image: String,
    pubDate: Date,
    contentSnippet: String,
    keywords: String,
    pubName: String,
    category: String,
    country: String
});
// Exports the model
module.exports = mongoose.model("Article", articleSchema);
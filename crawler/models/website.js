// The modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Creates the website schema
const websiteSchema = Schema({
    title: String,
    description: String,
    keywords: String,
    author: String,
    copyright: String,
    viewport: String,
    url: String,
    clicks: Number
});
// Exports the model
module.exports = mongoose.model("website", websiteSchema);
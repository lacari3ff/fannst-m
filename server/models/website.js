// The modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Creates the website schema
const websiteSchema = Schema({
    title: String,
    description: String,
    keywords: Array,
    author: String,
    copyright: String,
    viewport: String,
    url: String,
    clicks: Number,
    category: Number,
    icon: String
});
// Exports the model
module.exports = mongoose.model("Website", websiteSchema);
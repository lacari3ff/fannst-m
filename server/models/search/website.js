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
    rank: Number,
    icon: String,
    sublinks: Array,
    ismain: Boolean,
    domain: String,
    lang: String
});
// Exports the model
module.exports = mongoose.model("Website", websiteSchema);
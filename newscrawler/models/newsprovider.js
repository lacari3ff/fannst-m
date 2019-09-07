// The modules
const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
// Creates the Schema
const newsProviderSchema = Schema({
    title: String,
    description: String,
    link: String,
    copyright: String
});
// Exports the model
module.exports = mongoose.model("NewsProvider", newsProviderSchema);
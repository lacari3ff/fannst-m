// The modules
const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
// Creates the Schema
const weatherSchema = Schema({
    location: Object,
    current: Object,
    name: String,
    date: String,
    forecast: Object,
    lang: String
});
// Exports the model
module.exports = mongoose.model("Weather", weatherSchema);
// The modules
const mongoose  = require("mongoose");
const Schema  = mongoose.Schema;
// Creates the schema
const queryqueSchema = Schema({
    url: String,
    hid: String,
    date: Date
});
// Exports
module.exports = mongoose.model("Queryque", queryqueSchema);
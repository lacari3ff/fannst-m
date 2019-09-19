// Modules
const mongoose  = require("mongoose");
const Schema    = mongoose.Schema;
// Creates the image Schema
const imageSchema = Schema({
    src: String,
    url: String,
    keywords: Array,
    id: String,
    clicks: Number
});
// Exports the model
module.exports = mongoose.model("Image", imageSchema);
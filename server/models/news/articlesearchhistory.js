// The modules
const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
// Creates the Schema
const articleSearchHistorySchema = Schema({
    total: Number,
    params: String
});
// Exports the model
module.exports = mongoose.model("articleSearchHistory", articleSearchHistorySchema);
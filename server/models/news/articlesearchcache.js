// The modules
const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
// Creates the Schema
const articleSearchCacheSchema = Schema({
    params: String,
    results: Array,
    index: Number,
    expire: String
});
// Exports the model
module.exports = mongoose.model("ArticleSearchCache", articleSearchCacheSchema);
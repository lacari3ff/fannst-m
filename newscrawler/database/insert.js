// The models
const Article = require("../../server/models/news/article");
// Database
const dbos = require("../../server/database/dbos");
let dbo;
dbos.news(function (res) {
    dbo = res;
});
// Functions
function insertArticle (articleObject, cb) {
    Article.upsert(dbo, articleObject, function () {
        cb ();
    })
}
// Exports
module.exports = { insertArticle };
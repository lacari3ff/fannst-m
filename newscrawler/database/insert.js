// The models
const Article = require("../models/article");
// Functions
function insertArticle (article, cb) {
    Article.replaceOne({
        guid: article.guid
    }, {
        guid: article.guid,
        title: article.title,
        isoDate: article.isoDate,
        image: article.image,
        pubDate: article.pubDate,
        contentSnippet: article.contentSnippet,
        pubName: article.pubName,
        keywords: article.keywords,
        category: article.category,
        country: article.country
    }, {
        upsert: true
    }, function(err) {
        if(err)
            cb();
        else
            cb();
    })
}
// Exports
module.exports = { insertArticle };
// The models
const Article   = require("../models/news/article");
const Cache     = require("../models/news/cache");
const History   = require("../models/news/history");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.news(function (res) {
    dbo = res;
});
// The functions
function search(req, res, next) {
    // Checks if the required parameters are there
    if (req.body.params !== undefined && req.body.country !== undefined) {
        let country = req.body.country;
        let params = req.body.params.toLowerCase();
        // Handles the history
        History.findByParams(dbo, params, country, function (history) {
            History.upsert(dbo, {
                params: params,
                country: country,
                total: history ? history.total + 1 : 1
            }, function (status) {
                if (status) {
                    Cache.findByParams(dbo, params, country,function (cache) {
                        if (cache && new Date(cache.expire) > new Date()) {
                            res.json({
                                status: true,
                                articles: cache.results
                            });
                        } else {
                            // Generates the keywords
                            let keywords = params.split(" ");
                            // Searches through the articles by keywords
                            Article.keywordSearch(dbo, keywords, country, 0, 30, function (articles) {
                                if (articles) {
                                    // Removes the keywords from the cache
                                    articles.map(function (article) {
                                        delete article.keywords;
                                        return article;
                                    });
                                    // Creates the expire date
                                    let expire = new Date();
                                    expire.setDate(expire.getDate() + 2);
                                    // Creates the new article
                                    Cache.upsert(dbo, {
                                        results: articles,
                                        expire: expire,
                                        params: params,
                                        index: 0,
                                        country: country
                                    }, function (status) {
                                        if (status) {
                                            res.json({
                                                status: true,
                                                articles: articles
                                            });
                                        } else {
                                            res.json({
                                                status: false
                                            });
                                        }
                                    })
                                } else {
                                    res.json({
                                        status: false
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        status: false
                    });
                }
            })
        });

    } else {
        res.json({
            status: false
        })
    }
}
// Gets the autocomplete
function autocomplete (req, res, next) {
    if (req.body.params !== undefined && req.body.country !== undefined) {
        History.findByRegex(dbo, req.body.params, req.body.country, function (results) {
            if(results) {
                res.json({
                    status: true,
                    results: results
                });
            } else {
                res.json({
                    status: false
                })
            }
        })
    }
}
// Gets the latest
function getLatest (req, res, next) {
    if (req.body.category !== undefined && req.body.country !== undefined) {
        let category = req.body.category;
        let country = req.body.country;

        Article.getLatest(dbo, country, category, function (articles) {
            if (articles) {
                // Removes the keywords
                articles.map(function (article) {
                    delete article.keywords;
                    return article;
                });
                // Sends the json
                res.json({
                    status: true,
                    articles: articles
                })
            } else {
                res.json({
                    status: false
                })
            }
        })
    } else {
        res.json({
            status: false
        });
    }
}

module.exports = { getLatest, search, autocomplete };
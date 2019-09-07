// The models
const Article = require("../models/news/article");
const ArticleSearchCache = require("../models/news/articlesearchcache");
const ArticleSearchHistory = require("../models/news/articlesearchhistory");
// The functions
function search(req, res, next) {
    // Checks if the required parameters are there
    if(req.body.params !== undefined) {
        // Handles the history
        updateSearchHistory(req.body.params.toLowerCase(), function () {
            // Checks if there is already a cache available
            ArticleSearchCache.findOne({
                params: req.body.params.toLowerCase()
            }, function (err, searchcache) {
                if(err) {
                    res.json({
                        status: false
                    });
                } else if(searchcache && new Date(searchcache.expire) > new Date()) {
                    res.json({
                        status: true,
                        articles: searchcache.results
                    });
                } else {
                    // Finds the matches ordered by id
                    Article.find({
                        keywords: {$in: req.body.params.toLowerCase().split(" ")}
                    }).sort({pubDate: -1}).limit(30).exec(function(err, articles) {
                        articles.map(function (article) {
                            delete article.keywords;
                            return article;
                        });
                        // Creates the expire date
                        let expire = new Date();
                        expire.setDate(expire.getDate() + 2);
                        // Creates the results object
                        ArticleSearchCache.replaceOne({
                            params: req.body.params.toLowerCase()
                        }, {
                            results: articles,
                            expire: expire,
                            params: req.body.params.toLowerCase(),
                            index: 0
                        }, {
                            upsert: true
                        }, function (err) {
                            if(err) {
                                res.json({
                                    status: false
                                });
                            } else {
                                res.json({
                                    status: true,
                                    articles: articles
                                })
                            }
                        })
                    })
                }
            });
        });
    } else {
        res.json({
            status: false
        })
    }
}
// Gets the autocomplete
function autocomplete (req, res, next) {
    if(req.body.params != undefined) {
        ArticleSearchHistory.find({
            params: {$regex: req.body.params}
        }).limit(12).exec(function (err, results) {
            if(err) {
                res.json({
                    status: false
                });
            } else {
                res.json({
                    status: true,
                    results: results
                })
            }
        })
    } else {
        res.json({
            status: false
        });
    }
}
// Gets the latest
function getLatest (req, res, next) {
    if(req.body.category !== undefined) {
        Article.find({
            category: req.body.category
        }).sort({pubDate: -1}).limit(30).exec(function (err, articles) {
            if (err) {
                res.json({
                    status: false
                });
            } else {
                res.json({
                    status: true,
                    articles: articles
                });
            }
        })
    } else {
        res.json({
            status: false
        });
    }
}
// The other functions
function updateSearchHistory (params, cb) {
    ArticleSearchHistory.findOne({
        params: params
    }, function (err, history) {
        if(err) {
            cb ();
        } else if(history) {
            ArticleSearchHistory.updateOne({
                params: params
            }, {
                $set: {
                    total: history.total + 1
                }
            }, function (err) {
                if(err) {
                    cb ();
                } else {
                    cb ();
                }
            })
        } else {
            let activesearchhistoryd = new ArticleSearchHistory({
                params: params,
                total: 1
            });
            activesearchhistoryd.save(function (err) {
                if (err) {
                    cb ();
                } else {
                    cb ();
                }
            })
        }
    });
}
// Exports
module.exports = { getLatest, search, autocomplete };
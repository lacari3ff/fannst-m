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
    if(req.body.params !== undefined) {
        let params = req.body.params.toLowerCase();
        // Handles the history
        History.find
        Cache.findByParams(dbo, params, function (cache) {
            if (cache && new Date(cache.expire) > new Date()) {
                res.json({
                    status: true,
                    articles: cache.results
                });
            } else {
                // Generates the keywords
                let keywords = params.split(" ");
                // Searches through the articles by keywords
                Article.keywordSearch(dbo, keywords, 0, 30, function (articles) {
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
                           index: 0
                       }, function (status) {
                           if(status) {
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

        // updateSearchHistory(req.body.params.toLowerCase(), function () {
        //     // Checks if there is already a cache available
        //     ArticleSearchCache.findOne({
        //         params: req.body.params.toLowerCase()
        //     }, function (err, searchcache) {
        //         if(err) {
        //             res.json({
        //                 status: false
        //             });
        //         } else if(searchcache && new Date(searchcache.expire) > new Date()) {
        //             res.json({
        //                 status: true,
        //                 articles: searchcache.results
        //             });
        //         } else {
        //             // Finds the matches ordered by id
        //             Article.find({
        //                 keywords: {$in: req.body.params.toLowerCase().split(" ")}
        //             }).sort({pubDate: -1}).limit(30).exec(function(err, articles) {
        //                 articles.map(function (article) {
        //                     delete article.keywords;
        //                     return article;
        //                 });
        //                 // Creates the expire date
        //                 let expire = new Date();
        //                 expire.setDate(expire.getDate() + 2);
        //                 // Creates the results object
        //                 ArticleSearchCache.replaceOne({
        //                     params: req.body.params.toLowerCase()
        //                 }, {
        //                     results: articles,
        //                     expire: expire,
        //                     params: req.body.params.toLowerCase(),
        //                     index: 0
        //                 }, {
        //                     upsert: true
        //                 }, function (err) {
        //                     if(err) {
        //                         res.json({
        //                             status: false
        //                         });
        //                     } else {
        //                         res.json({
        //                             status: true,
        //                             articles: articles
        //                         })
        //                     }
        //                 })
        //             })
        //         }
        //     });
        // });
    } else {
        res.json({
            status: false
        })
    }
}
// Gets the autocomplete
function autocomplete (req, res, next) {
    // if(req.body.params != undefined) {
    //     ArticleSearchHistory.find({
    //         params: {$regex: req.body.params}
    //     }).limit(12).exec(function (err, results) {
    //         if(err) {
    //             res.json({
    //                 status: false
    //             });
    //         } else {
    //             res.json({
    //                 status: true,
    //                 results: results
    //             })
    //         }
    //     })
    // } else {
    //     res.json({
    //         status: false
    //     });
    // }
}
// Gets the latest
function getLatest (req, res, next) {
    // if(req.body.category !== undefined && req.body.country !== undefined) {
    //     Article.find({
    //         $and: [
    //             {
    //                 category: req.body.category
    //             },
    //             {
    //                 country: req.body.country
    //             }
    //         ]
    //     }).sort({pubDate: -1}).limit(30).exec(function (err, articles) {
    //         if (err) {
    //             res.json({
    //                 status: false
    //             });
    //         } else {
    //             res.json({
    //                 status: true,
    //                 articles: articles
    //             });
    //         }
    //     })
    // } else {
    //     res.json({
    //         status: false
    //     });
    // }
}
// The other functions
function updateSearchHistory (params, cb) {
    // ArticleSearchHistory.findOne({
    //     params: params
    // }, function (err, history) {
    //     if(err) {
    //         cb ();
    //     } else if(history) {
    //         ArticleSearchHistory.updateOne({
    //             params: params
    //         }, {
    //             $set: {
    //                 total: history.total + 1
    //             }
    //         }, function (err) {
    //             if(err) {
    //                 cb ();
    //             } else {
    //                 cb ();
    //             }
    //         })
    //     } else {
    //         let activesearchhistoryd = new ArticleSearchHistory({
    //             params: params,
    //             total: 1
    //         });
    //         activesearchhistoryd.save(function (err) {
    //             if (err) {
    //                 cb ();
    //             } else {
    //                 cb ();
    //             }
    //         })
    //     }
    // });
}
// Exports
module.exports = { getLatest, search, autocomplete };
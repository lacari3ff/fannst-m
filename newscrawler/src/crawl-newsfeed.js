// The modules
const RSSParser     = require("rss-parser");
const parser        = new RSSParser();
const keywordextr   = require("keyword-extractor");
// The sources
const insert = require("../database/insert");
// The functions
function crawlFeeds (rss_feeds, lang, category, cb) {
    let parselang = "";
    switch(lang) {
        case "nl":
            parselang = "dutch";
            break;
        case "uk":
            parselang = "english";
            break;
        default:
            parselang = "english";
            break;
    }
    let i = 0;
    function feedEntry () {
        if (i + 1 > rss_feeds.length) {
            cb ();
        } else {
            i++;
            if(rss_feeds[i]) {
                let news_feed = rss_feeds[i].rss_url;
                let news_feed_name = rss_feeds[i].name;
                parser.parseURL(news_feed, function (err, feed) {
                    let j = 0;
                    function articleEntry() {
                        if (!feed || j + 1 > feed.items.length) {
                            feedEntry();
                        } else {
                            j++;
                            let article_raw = feed.items[j];
                            if(article_raw) {
                                // Catches insertion error
                                try {
                                    let article = {
                                        guid: article_raw.guid,
                                        title: article_raw.title,
                                        isoDate: new Date(article_raw.isoDate),
                                        image: article_raw.enclosure || article_raw.image ? (article_raw.image ? article_raw.image : article_raw.enclosure.url) : "default",
                                        pubDate: new Date(article_raw.pubDate),
                                        contentSnippet: article_raw.contentSnippet,
                                        keywords: keywordextr.extract(article_raw.contentSnippet, {
                                            lang: parselang,
                                            remove_digits: true,
                                            return_changed_case: true,
                                            remove_duplicates: true
                                        }),
                                        pubName: news_feed_name,
                                        category: category,
                                        country: lang
                                    };
                                    insert.insertArticle(article, function() {
                                        //console.log("Inserted: " + article.title, ", From: " + feed.title + ", language: " + lang + ", category: " + category);
                                        setTimeout(function () {
                                            articleEntry();
                                        }, 50)
                                    })
                                } catch(e) {
                                    console.log(e);
                                    setTimeout(function () {
                                        articleEntry();
                                    }, 50)
                                }
                            } else {
                                articleEntry();
                            }
                        }
                    }
                    articleEntry();
                });
            } else {
                feedEntry();
            }
        }
    }

    feedEntry();
}
// The full function
function full (countrys, cb) {
    let i = 0;
    function countryEntry() {
        let country = countrys[i];
        if(i + 1 > countrys.length) {
            cb (true);
        } else {
            i++;
            let total = 0;
            let processingTime = 0;
            let start = new Date();
            // Starts the normal round
            crawlFeeds(country.normal, country.country, "normal",function () {
                processingTime = new Date() - start;
                total += processingTime;
                console.log(`Processed normal for: ${country.country}, in: ${processingTime}ms`);
                start = new Date();
                // Starts the science round
                crawlFeeds(country.science, country.country, "science",function () {
                    processingTime = new Date() - start;
                    total += processingTime;
                    console.log(`Processed science for: ${country.country}, in: ${processingTime}ms`);
                    start = new Date();
                    // Starts the business round
                    crawlFeeds(country.business, country.country, "business",function () {
                        processingTime = new Date() - start;
                        total += processingTime;
                        console.log(`Processed business for: ${country.country}, in: ${processingTime}ms`);
                        start = new Date();
                        // Starts the sports round
                        crawlFeeds(country.sports, country.country, "sports",function () {
                            processingTime = new Date() - start;
                            total += processingTime;
                            console.log(`Processed sports for: ${country.country}, in: ${processingTime}ms`);
                            console.log(`Total processing time for ${country.country}: ${total}ms\n\n`);
                            // Starts the business round
                            countryEntry();
                        });
                    });
                });
            });
        }
    }
    countryEntry();
}
// Exports
module.exports = { full };
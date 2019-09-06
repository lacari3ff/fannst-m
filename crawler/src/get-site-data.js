// The modules
const cheerio           = require("cheerio");
const urlp              = require("url");
const keywordExtractor  = require("keyword-extractor");
// The source files
const request           = require("./request");
const storeErr          = require("./store-err");
// The image parse function
function parseImages (html, url, keywords, cb) {
    // Catches errors
    try {
        let $ = cheerio.load(html);
        // Gets the images
        let parsed = [];
        let images = $("img");
        // Loops through them and pushes the images to the array
        for(let i = 0; i < images.length; i++) {
            parsed.push({
                src: correctSource(images[i].attribs.src, url),
                url: url,
                keywords: keywords,
                clicks: 0
            });
        }
        // Returns the image array
        cb(parsed);
    } catch (e) {
        storeErr.appendFile(e);
        cb(false);
    }
}
// The html parse function
function parseHTML (html, url, cb) {
    // Catches errors
    try {
        // The uri
        let urld = urlp.parse(url, true);
        // Loads the html
        let $ = cheerio.load(html);
        // Gets the Links
        let anchorsRaw = $("a");
        let anchors = [];
        for (let i = 0; i < anchorsRaw.length; i++) {
            let anchor = anchorsRaw[i].attribs.href;
            if(anchor !== undefined && anchor !== "")
                anchors.push(correctSource(anchor, url));
        }
        // Gets the values
        let title = $("title").text();
        let description = $('meta[name="description"]').attr("content");
        let author = $('meta[name="author"]').attr("content");
        let copyright = $('meta[name="copyright"]').attr("content");
        let viewport = $('meta[name="viewport"]').attr("content");
        let initialKeywords = $('meta[name="keywords"]').attr("content");
        let icon = $('link[rel="icon"]').attr("href");
        let ismain = checkIfSiteIsMain(urld.pathname);
        let domain = urld.hostname;
        let keywords = generateKeywordTest(title ? title : "", description ? description : "", initialKeywords ? initialKeywords : "");
        let lang = $('html').attr("lang");
        // Generates the sub links
        fetchsublinks(anchors, ismain, domain, function(sublinks) {
            // Checks if the values are set, and generates object
            let websiteObject = {
                title: title ? title.split("\n").join("") : "",
                description: description ? description : "",
                keywords: keywordExtractor.extract(keywords, {
                    language: "english",
                    remove_digits: true,
                    return_changed_case: true,
                    remove_duplicates: true
                }),
                author: author ? author.split("\n").join("") : "",
                copyright: copyright ? copyright.split("\n").join("") : "",
                viewport: viewport ? viewport : "",
                url: url,
                clicks: 0,
                icon: icon ? correctSource(icon, url) : "",
                ismain: ismain,
                sublinks: sublinks,
                domain: urld.hostname,
                lang: lang ? lang : ""
            };
            // Appends a rank to the object
            getSiteQuality(websiteObject, function(rank) {
                websiteObject.rank = rank;
                // Returns the website object
                cb(websiteObject, anchors);
            });
        })
    } catch (e) {
        console.log(e);
        storeErr.appendFile(e);
        cb(false, null);
    }
}
// Gets the site quality
function getSiteQuality (websiteObject, cb) {
    let rank = 0;
    if(websiteObject.title !== "") rank += 1;
    if(websiteObject.description !== "") rank += 1;
    if(websiteObject.keywords !== "") rank += 1;
    if(websiteObject.author !== "") rank += 1;
    if(websiteObject.copyright !== "") rank += 1;
    if(websiteObject.viewport !== "") rank += 1;
    cb(rank)
}
// Corrects the image url
function correctSource(src, url) {
    if(src.substring(0, 8) === "https://" || src.substring(0, 7) === "http://") {
        return src;
    } else {
        let urld = urlp.parse(url, true);
        let before = urld.protocol + "//" + urld.hostname + "/";

        if (src.substring(0, 2) === "//") {
            return before + src.substring(2, src.length) ;
        } else if(src.substring(0, 1) === "/") {
            return before + src.substring(1, src.length) ;
        } else {
            return before + src;
        }
    }
}
// Generates the keywords text
function generateKeywordTest(title, description, initial) {
    let result = "";
    if(initial !== "") result += initial;
    result += " ";
    if(title !== "") result += title;
    result += " ";
    if(description !== "") result += description;
    return result;
}
// Checks if site is main
function checkIfSiteIsMain (path) {
    if(path === "/") {
        return true;
    } else {
        return false;
    }
}
// Fetch sublinks
function fetchsublinks(anchors, ismain, domain, cb) {
    // Checks if it is a main site
    if(ismain) {
        if(anchors.length >= 1) {
            // Simpler for loop
            let i = 0;
            let processed = 0;
            let sublinks = [];
            function entry () {
                processed++;
                // Checks if it should quit or continue
                if (processed > anchors.length || sublinks.length > 6) {
                    cb(sublinks)
                } else {
                    request.get(anchors[i], function(html, url) {
                        if (html) {
                            let sub$ = cheerio.load(html);
                            let title = sub$("title").text();
                            let desc = sub$('meta[name="description"]').attr("content");
                            // Checks if the title is defiend
                            if(title) {
                                sublinks.push({
                                    title: title.split("\n").join(" "),
                                    url: url,
                                    desc: desc ? desc : ""
                                });
                                entry();
                            } else {
                                entry();
                            }
                        } else {
                            entry();
                        }
                    })
                }
                i++;
            }
            entry();
        } else {
            cb([]);
        }
    } else
        cb([]);
}
// Exports
module.exports = { parseHTML, parseImages };
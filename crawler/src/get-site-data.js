// The modules

// The source files
const storeErr  = require("./store-err");
const cheerio   = require("cheerio");
// The functions
function parse (html, url, cb) {
    // Catches errors
    try {
        let $ = cheerio.load(html);
        // Gets the values
        let title = $("title").text();
        let description = $('meta[name="description"]').attr("content");
        let keywords = $('meta[name="keywords"]').attr("content");
        let author = $('meta[name="author"]').attr("content");
        let copyright = $('meta[name="copyright"]').attr("content");
        let viewport = $('meta[name="viewport"]').attr("content");
        // Checks if the values are set, and generates object
        let websiteObject = {
            title: title ? title.split("\n").join("") : "",
            description: description ? description : "",
            keywords: keywords ? keywords.split("\n").join("") : "",
            author: author ? author.split("\n").join("") : "",
            copyright: copyright ? copyright.split("\n").join("") : "",
            viewport: viewport ? viewport : "",
            url: url,
            clicks: 0
        };
        // Appends a rank to the object
        websiteObject.rank = getSiteQuality(websiteObject);
        // Returns the website object
        cb(websiteObject);
    } catch(e) {
        cb(false);
    }
}
// Gets the site quality
function getSiteQuality (websiteObject) {
    let rank = 0;
    if(websiteObject.title !== "") rank += 1;
    if(websiteObject.description !== "") rank += 1;
    if(websiteObject.keywords !== "") rank += 1;
    if(websiteObject.author !== "") rank += 1;
    if(websiteObject.copyright !== "") rank += 1;
    if(websiteObject.viewport !== "") rank += 1;
    return rank;
}
// Exports
module.exports = { parse };
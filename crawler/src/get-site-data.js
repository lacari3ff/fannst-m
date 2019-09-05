// The modules
const cheerio           = require("cheerio");
const crypto            = require("crypto");
const keywordExtractor  = require("keyword-extractor");
// The source files
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
                src: correctImageSource(images[i].attribs.src, url),
                url: url,
                keywords: keywords,
                clicks: 0,
                id: crypto.randomBytes(64).toString("hex").substring(0, 98)
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
        let $ = cheerio.load(html);
        // Gets the values
        let title = $("title").text();
        let description = $('meta[name="description"]').attr("content");
        let author = $('meta[name="author"]').attr("content");
        let copyright = $('meta[name="copyright"]').attr("content");
        let viewport = $('meta[name="viewport"]').attr("content");
        let initialKeywords = $('meta[name="keywords"]').attr("content");
        let keywords = generateKeywordTest(title ? title : "", description ? description : "", initialKeywords ? initialKeywords : "");
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
            clicks: 0
        };
        // Appends a rank to the object
        websiteObject.rank = getSiteQuality(websiteObject);
        // Returns the website object
        cb(websiteObject);
    } catch (e) {
        storeErr.appendFile(e);
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
// Corrects the image url
function correctImageSource(src, url) {
    if(url.includes("https://") || url.includes("http://")) {
        return src;
    } else {
        if(url.substring(url.length - 1, url.length) !== "/") {
            url += "/";
        }

        if (src.substring(0, 2) === "//") {
            return url + src.substring(2, src.length) ;
        } else if(src.substring(0, 1) === "/") {
            return url + src.substring(1, src.length) ;
        } else {
            return url + src;
        }
    }
}
// Generates the keywords text
function generateKeywordTest(title, description, initial) {
    let result = "";
    if(title !== "") result += title;
    result += " ";
    if(description !== "") result += description;
    result += " ";
    if(initial !== "") result += initial;
    return result;
}
// Exports
module.exports = { parseHTML, parseImages };
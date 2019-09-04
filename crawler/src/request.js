// The modules
const https     = require("https");
const http      = require("http");
const urlp       = require("url");
// The source files
const storeErr  = require("./store-err");
// The functions
function get(url, cb) {
    // Gets the request type
    let siteType = getSiteType(url);
    // Checks the request type
    if (siteType === "https") {
        getHTTPS(url, "", function(result) {
            if(result) cb(result, url);
            else cb(false, null)
        });
    } else if (siteType === "http") {
        getHTTP(url,"",function(result) {
            if(result) cb(result, url);
            else cb(false, null);
        });
    } else { // None
        getHTTPS(url,"https://",function(result) {
            if(result) {
                if(result) cb(result, `https://${url}`);
                else cb(false, null);
            } else {
                getHTTP(url, "http://",function(result) {
                    if(result) cb(result, `http://${url}`);
                    else cb(false, null);
                });
            }
        });
    }
}
// HTTPS get
function getHTTPS(url, before, cb) {
    let request = https.get(createConfigObject(url, 5000, 443, before), function (res) {
        let body = "";
        // DATA data listener
        res.on("data", function (chunk) {
            body += chunk;
        });
        // END data listener
        res.on("end", function () {
            cb(body);
        });
    }).on("error", function (error) {
        storeErr.appendFile(error);
        cb(false);
    }).on("timeout", function () {
        request.abort();
        cb(false);
    });
}
// HTTP get
function getHTTP(url, before, cb) {
    let request = http.get(createConfigObject(url, 5000, 80, before), function (res) {
        let body = "";
        // DATA data listener
        res.on("data", function (chunk) {
            body += chunk;
        });
        // END data listener
        res.on("end", function () {
            cb(body);
        })
    }).on("error", function (error) {
        storeErr.appendFile(error);
        cb(false);
    }).on("timeout", function () {
        request.abort();
        cb(false);
    });
}
// The url type function
function getSiteType(url) {
    if (url.includes("https://")) {
        return "https";
    } else if (url.includes("http://")) {
        return "http"
    } else {
        return "none"
    }
}
// Create config object
function createConfigObject(url, timeout, port, before) {
    if(before !== "") url = before += url;

    url = urlp.parse(url);

    return {
        hostname: url.hostname,
        path: url.pathname,
        port: port,
        timeout: timeout,
        headers: { 'User-Agent': 'Mozilla/5.0' }
    };
}
// Exports
module.exports = { get };
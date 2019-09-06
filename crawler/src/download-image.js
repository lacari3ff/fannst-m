// The modules
const urlp          = require("url");
const http          = require("http");
const https         = require("https");
const path          = require("path");
const fs            = require("fs");
const sharp         = require("sharp");
// The src
const storeErr      = require("./store-err");
const request       = require("./request");
// The dirs
const __TMPDIR      = `${__dirname}/../temp/icons`;
const __OUTDIR      = `${__dirname}/../../server/public/auto/icons`;
// The function
function icon (url, cb) {
    let siteType = getSiteType(url);
    if(siteType === "http") {
        let request = http.get(url, function (res) {
            let body = "";
            // Sets the enctype to binary
            res.setEncoding("binary");
            // Handles the data
            res.on("data", function (chunk) {
                body += chunk;
            });
            // Handles the end
            res.on("end",  function () {
                let filename = getIconFileName(url);
                let outfile = `${filename.substring(0, filename.length - 4)}.jpg`;
                fs.writeFile(path.resolve(`${__TMPDIR}/${filename}`), body, "binary", function(err) {
                    processIcon(filename, outfile).then(function () {
                        cb(null, outfile);
                    }).catch(function (err) {
                        cb(err, null);
                    });
                });
            });
        }).on("error", function (error) {
            request.abort();
            storeErr.appendFile(error);
            cb(error, null);
        }).on("timeout", function () {
            request.abort();
            cb(new Error("Timeout in request."), null);
        });
    } else if(siteType === "https") {
        let request = https.get(url, function (res) {
            let body = "";
            // Sets the enctype to binary
            res.setEncoding("binary");
            // Handles the data
            res.on("data", function (chunk) {
                body += chunk;
            });
            // Handles the end
            res.on("end",  function () {
                let filename = getIconFileName(url);
                let outfile = `${filename.substring(0, filename.length - 4)}.jpg`;
                fs.writeFile(path.resolve(`${__TMPDIR}/${filename}`), body, "binary", function(err) {
                    processIcon(filename, outfile).then(function () {
                        cb(null, outfile);
                    }).catch(function (err) {
                        cb(err, null);
                    });
                });
            });
        }).on("error", function (error) {
            request.abort();
            storeErr.appendFile(error);
            cb(error, null);
        }).on("timeout", function () {
            request.abort();
            cb(new Error("Timeout in request."), null);
        });
    } else {
        cb(new Error("Invalid file type"), null);
    }
}
// The url type function
function getSiteType(url) {
    if(url) {
        if (url.includes("https://")) {
            return "https";
        } else if (url.includes("http://")) {
            return "http"
        } else {
            return "none"
        }
    } else {

        return "none";
    }
}
// Processes the file
async function processIcon(filename, output, cb) {
    await sharp(path.resolve(`${__TMPDIR}/${filename}`))
        .resize(20, 20)
        .toFile(path.resolve(`${__OUTDIR}/${output}`))
}
// Gets the file name
function getIconFileName (url) {
    let urld = urlp.parse(url, true);
    let before = `${urld.protocol}//${urld.hostname}${urld.pathname}`;
    // Gets the extension
    if(before.substring(before.length, before.length - 4) === ".jpg") {
        return `${urld.hostname.split(".").join("-")}-${Date.now()}.jpg`;
    } else if(before.substring(before.length, before.length - 4) === ".png") {
        return `${urld.hostname.split(".").join("-")}-${Date.now()}.png`;
    } else if(before.substring(before.length, before.length - 4) === ".gif") {
        return `${urld.hostname.split(".").join("-")}-${Date.now()}.gif`;
     }else if(before.substring(before.length, before.length - 4) === ".ico") {
        return `${urld.hostname.split(".").join("-")}-${Date.now()}.ico`;
    }
}
// Exports
module.exports = { icon };
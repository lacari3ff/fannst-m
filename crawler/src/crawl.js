// The src
const storeErr          = require("./store-err");
const request           = require("./request");
const getSiteData       = require("./get-site-data");
const insert            = require("../database/insert");
const classify          = require("../lib/classify");
const downloadImage     = require("./download-image");
// The functions
function crawl(surl, cb) {
    request.get(surl,async function (html, url) {
        if(html) {
            getSiteData.parseHTML(html, url, async function (websiteObject, anchors) {
                downloadImage.icon(websiteObject.icon, function(err, icon) {
                    websiteObject.icon = err ? "default" : icon;
                    websiteObject.category = classify.classifySiteCategory(html);
                    insert.insertSite(websiteObject).then(async function () {
                        getSiteData.parseImages(html, url, websiteObject.keywords, async function (images) {
                            insert.bulkInsertImages(images).then(async function() {
                                cb(true, anchors);
                            }).catch(async function (e) {
                                storeErr.appendFile(e);
                                cb(false, anchors);
                            })
                        });
                    }).catch(async function (e) {
                        storeErr.appendFile(e);
                        cb(false, anchors);
                    })
                });
            });
        } else
            cb(false, null);
    });
}
module.exports = crawl;
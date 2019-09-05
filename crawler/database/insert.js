// Modules
const mongoose      = require("mongoose");
const crypto        = require("crypto");
const fs            = require("fs");
const path          = require("path");
// The models
const Website       = require("../models/website");
const Image         = require("../models/image");
// the Src
const storeErr      = require("../src/store-err");
// Constants
const __ICONDIR = `${__dirname}/../../server/public/auto/icons`;
// The website insert function
async function insertSite(site) {
    if(site.url !== null && site.url !== "") {
        await Website.findOne({
            url: site.url
        }).then(async function (product) {
            if(product) {
                fs.unlink(path.resolve(`${__ICONDIR}/${product.icon}`), function(err) {
                    if(!err) {
                        Website.updateOne({
                            _id: product._id
                        }, {
                            $set: {
                                title: site.title,
                                description: site.description,
                                keywords: site.keywords,
                                author: site.author,
                                copyright: site.copyright,
                                viewport: site.viewport,
                                category: site.category,
                                rank: site.rank,
                                icon: site.icon
                            }
                        })
                    }
                });
            } else {
                let newWebsite = new Website(site);
                await newWebsite.save();
            }
        }).catch(async function (err) {
            storeErr.appendFile(err);
        });
    }
}
// The image insert function
async function bulkInsertImages(images) {
    let processed = 0;
    for (let i = 0; i < images.length; i++) {
        // Checks if the job is done
        if (processed > images.length)
            return;
        else {
            let image = images[i];
            // Waits and finds the image
            await Image.findOne({
                src: image.src
            }).then(async function (product) {
                // Checks if the image exists, and performs the operation
                if (product) {
                    await Image.updateOne({
                        _id: product._id
                    }, {
                        $set: {
                            keywords: image.keywords
                        }
                    });
                    // Adds to the processed
                    processed++;
                } else {
                    // Creates tje new image
                    let newImage = new Image(image);
                    // Stores the image
                    await newImage.save();
                    // Adds to the processed
                    processed++;
                }
            }).catch(async function (err) {
                storeErr.appendFile(err);
                processed++;
            });
        }
    }
}

module.exports = { bulkInsertImages, insertSite };
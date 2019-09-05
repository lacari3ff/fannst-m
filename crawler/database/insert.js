// Modules
const mongoose      = require("mongoose");
const Image         = require("../models/image");
// the Src
const storeErr      = require("./src/store-err");
// The website insert function

// The image insert function
async function bulkInsertImages(images) {
    let processed = 0;
    for (let i = 0; i < images.length; i++) {
        // Checks if the job is done
        if (processed > images.length)
            return true;
        else {
            let image = images[i];
            // Waits and finds the image
            await Image.findOne({
                src: image.src
            }).then(async function (product) {
                // Checks if the image exists, and performs the operation
                if (product) {
                    // TODO: Modify the operator so the ID will be given at query or only the default mongoose object id.
                    await Image.updateOne({
                        src: image.src
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
    /*
    let exists = await Image.findOne({
        src: image.src
    });
    // Checks if it exists
    if(exists) {

    } else {
        let imaged = new Image(image);
        await imaged.save();
    }
    */
}

module.exports = { bulkInsertImages };
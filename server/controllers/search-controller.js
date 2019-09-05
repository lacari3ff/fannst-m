// The models
const Website = require("../models/website");
const Image = require("../models/image");
// The functions
function search (req, res, next) {
    let params = req.params.params;
    if(params) {
        Website.find({
            keywords: {
                $in: params.toLowerCase()
            }
        }).then(function (websites) {
            Image.find({
                keywords: {
                    $in: params.toLowerCase()
                }
            }).sort({_id: -1}).limit(6).then(function (images) {
                res.json({
                    status: true,
                    results: websites,
                    images: images
                })
            })
        })
    } else
        res.json({
            status: false
        });
}
// Exports
module.exports = { search };
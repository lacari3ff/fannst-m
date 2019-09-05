// The models
const Website = require("../models/website");
// The functions
function search (req, res, next) {
    let params = req.params.params;
    if(params) {
        Website.find({
            keywords: {
                $in: params.toLowerCase()
            }
        }).then(function (websites) {
            res.json({
                status: true,
                websites: websites
            })
        })
    } else
        res.json({
            status: false
        });
}
// Exports
module.exports = { search };
// The models
const Website = require("../models/website");
const Image = require("../models/image");
// The functions
function search (req, res, next) {
    let params = req.params.params;
    if(params) {
        if (params.includes("@website:")) {
            let param = params.split("@website:")[1];
            let domain = param.split(",")[0];
            let regex = param.split(",")[1];
            Website.find({
                $and: [
                    {
                        domain: domain
                    },
                    {
                        $or: [
                            {
                                url: {
                                    $regex: regex
                            }
                            },
                            {
                                description: {
                                    $regex: regex
                                }
                            }
                        ]
                    }
                ]
            }).then(function (websites) {
                res.json({
                    status: true,
                    results: websites,
                    images: []
                })
            })
        } else {
            Website.find({
                $or: [
                    {
                        keywords: {
                            $in: params.toLowerCase()
                        },
                        lang: "nl"
                    },
                    {
                        url: {
                            $regex: params.toLocaleLowerCase()
                        }
                    }
                ]
            }).then(function (websites) {
                Image.find({
                    $or: [
                        {
                            keywords: {
                                $in: params.toLowerCase()
                            }
                        },
                        {
                            url: {
                                $regex: params.toLocaleLowerCase()
                            }
                        }
                    ]
                }).sort({_id: -1}).limit(6).then(function (images) {
                    res.json({
                        status: true,
                        results: websites,
                        images: images
                    })
                })
            })
        }
    } else
        res.json({
            status: false
        });
}
// Exports
module.exports = { search };
// The models
const Website =             require("../models/search/website");
const Image =               require("../models/search/image");
const keywordExtractor =    require("keyword-extractor");
// The functions
function defaultsearch (req, res, next) {
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

            let keywords = params.split(" ");

            /*
            let result = [];

            Website.aggregate([
                {$match: {keywords: {$in: keywords}}},
                {$unwind: "$keywords"},
                {$match: {keywords: {$in: keywords}}},
                {$group: {
                        _id:{_id:"$_id"},
                        matches:{$sum:1},
                        "rank": {$push: "$rank"},
                        "ismain": {$push: "$ismain"}
                    }},
                {$sort:{ismain: 1}}
            ]).exec(function(err, res) {
                res.map(a => a._id);

                res.forEach(res => {
                    Website.findOne({
                       _id: res._id
                    }, function(err, res) {
                        result.push(res);
                    });
                })
            });

            setTimeout(function() {
                res.json({
                    status: true,
                    results: result,
                    images: []
                })
            }, 1200)
*/


            Website.find({
                $or: [
                    {
                        keywords: {
                            $in: keywords
                        },
                        lang: "nl"
                    },
                    {
                        url: {
                            $regex: params.toLocaleLowerCase()
                        }
                    }
                ]
            }).sort({ismain: -1, rank: -1}).then(function (websites) {
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
// The image search function
function imagesearch (req, res, next) {
    let params = req.params.params;
    if(params) {
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
    } else
        res.json({
            status: false
        });
}
// Exports
module.exports = { defaultsearch, imagesearch };
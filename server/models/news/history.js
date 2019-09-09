class History {
    constructor (historyObject) {
        this.total      = historyObject.total;
        this.country    = historyObject.country;
        this.params     = historyObject.params;
    }

    save (dbo, cb) {
        dbo.collection("history").insertOne(this, function (err) {
            cb (!err);
        });
    }

    static upsert (dbo, historyObject, cb) {
        dbo.collection("history").replaceOne({
            params: historyObject.params
        }, {
            country: historyObject.country,
            params: historyObject.params,
            total: historyObject.total
        }, {
            upsert: true
        }, function (err) {
            cb(!err);
        })
    }

    static findByRegex (dbo, params, country, cb) {
        dbo.collection("history").find({
            $and: [
                {
                    country: country
                },
                {
                    params: {
                        $regex: params
                    }
                }
            ]
        }).sort({tatal: -1}).limit(12).toArray(function (err, results) {
            cb (err ? false : results);
        });
    }

    static findByParams (dbo, params, country, cb) {
        dbo.collection("history").findOne({
            $and: [
                {
                    params: params
                },
                {
                    country: country
                }
            ]
        }, function (err, result) {
            cb (err ? false : result);
        });
    }
}

module.exports = History;
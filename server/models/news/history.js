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

    static findByRegex (dbo, params, country, cb) {
        dbo.collection("history").findOne({
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
        }, function (err, results) {
            cb(err ? false : results);
        });
    }

    static findByParams (dbo, params, country) {
        dbo.collection()
    }
}
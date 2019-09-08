class Cache {
    constructor (cacheObject) {
        this.params     = cacheObject.params;
        this.results    = cacheObject.results;
        this.index      = cacheObject.index;
        this.expire     = cacheObject.expire;
        this.country    = cacheObject.country;
    }

    save (dbo, cb) {
        dbo.collection("cache").insertOne(this, function (err) {
            cb(!err);
        });
    }

    static upsert (dbo, cacheObject, cb) {
        dbo.collection("cache").replaceOne({
            $and: [
                {
                    params: cacheObject.params
                },
                {
                    country: cacheObject.country
                }
            ]
        }, {
            params: cacheObject.params,
            results: cacheObject.results,
            index: cacheObject.index,
            expire: cacheObject.expire,
            country: cacheObject.country
        }, {
            upsert: true
        }, function (err) {
            cb (!err);
        });
    }

    static findByParams (dbo, params, country, cb) {
        dbo.collection("cache").findOne({
            $and: [
                {
                    params: params
                },
                {
                    country: country
                }
            ]
        }, function (err, cache) {
            if (err)
                cb (false);
            else if (cache)
                cb (cache);
            else
                cb (false);
        });
    }
}

module.exports = Cache;
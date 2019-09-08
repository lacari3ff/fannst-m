class Cache {
    constructor (cacheObject) {
        this.params     = cacheObject.params;
        this.results    = cacheObject.results;
        this.index      = cacheObject.index;
        this.expire     = cacheObject.expire;
    }

    save (dbo, cb) {
        dbo.collection("cache").insertOne(this, function (err) {
            cb(!err);
        });
    }

    static upsert (dbo, cacheObject, cb) {
        dbo.collection("cache").replaceOne({
           params: cacheObject.params
        }, {
            params: cacheObject.params,
            results: cacheObject.results,
            index: cacheObject.index,
            expire: cacheObject.expire
        }, {
            upsert: true
        }, function (err) {
            cb (!err);
        });
    }

    static findByParams (dbo, params, cb) {
        dbo.collection("cache").findOne({
            params: params
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
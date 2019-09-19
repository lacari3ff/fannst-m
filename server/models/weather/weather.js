class Weather {
    constructor (weatherObject) {
        this.location   = weatherObject.location;
        this.current    = weatherObject.current;
        this.city       = weatherObject.city;
        this.date       = weatherObject.date;
        this.forecast   = weatherObject.forecast;
        this.lang       = weatherObject.lang;
    }

    save (dbo, cb) {
        dbo.collection("weather").insertOne(this, function (err) {
            cb (!err);
        });
    }

    static getWeather (dbo, city, date, lang, cb) {
        dbo.collection("weather").findOne({
            $and: [
                {
                    city: city
                },
                {
                    date: date
                },
                {
                    lang: lang
                }
            ]
        }, function (err, weather) {
            if (err)
                cb (false);
            else if (weather)
                cb (weather);
            else
                cb (false);
        });
    }
}

module.exports = Weather;
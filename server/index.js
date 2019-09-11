// The modules
const express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
const path = require("path");
const device = require("express-device");
// Initializes
const app = express();
app.set("views", "views");
app.set("render engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(
  BodyParser.urlencoded({
    extended: false
  })
);
app.use(
  device.capture({
    parseUserAgent: true
  })
);
// The Routes
const SearchRoute = require("./routes/search-route");
const WeatherRoute = require("./routes/weather-route");
const NewsRoute = require("./routes/news-route");
const AuthRoute = require("./routes/auth-route");
const AccountRoute = require("./routes/account-route");
app.use("/rest/search", SearchRoute);
app.use("/rest/weather", WeatherRoute);
app.use("/rest/news", NewsRoute);
app.use("/rest/auth", AuthRoute);
app.use("/rest/account", AccountRoute);
app.get("*", function(req, res, next) {
  let domain = req.hostname;
  let p = req.path;

  switch (domain) {
    case "news.fannst.nl": {
      switch (p) {
        case "/": {
          res.redirect(301, "/frontpage");
          break;
        }
        default: {
          res.sendFile(path.resolve(`${__dirname}/views/news/index.html`));
          break;
        }
      }
      break;
    }
    case "auth.fannst.nl": {
      switch (p) {
        case "/": {
          res.redirect(301, "/signin");
          break;
        }
        default: {
          res.sendFile(path.resolve(`${__dirname}/views/auth/index.html`));
          break;
        }
      }
      break;
    }
    default: {
      res.render("404.ejs", {
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        ua: req.headers["user-agent"],
        path: req.pathname,
        domain: req.hostname,
        url: req.url
      });
      break;
    }
  }
});
// Listens
app.listen(80);

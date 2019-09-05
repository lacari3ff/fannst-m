// The modules
const express        = require("express");
const mongoose       = require("mongoose");
// The src
const storeErr       = require("./src/store-err");
const request        = require("./src/request");
const getSiteData    = require("./src/get-site-data");
const insert         = require("./database/insert");
// Connects mongoose
mongoose.connect("mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb", {
   useNewUrlParser: true,
   dbName: "fannst_index"
});

request.get("www.minecraft.net", function (html, url) {
   getSiteData.parseHTML(html, url, function (websiteObject) {
      getSiteData.parseImages(html, url, websiteObject.keywords, function (images) {
         insert.bulkInsertImages(images).then(function() {
            console.log("done")
         }).catch(function (e) {
            console.log(e);
         })
      });
   });
});
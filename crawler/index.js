// The modules
const express        = require("express");
const mongoose       = require("mongoose");
// The models
const Queryque       = require("./models/queryque");
// The src
const crawl          = require("./src/crawl");
// Connects mongoose
mongoose.connect("mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb", {
   useNewUrlParser: true,
   dbName: "fannst_index"
});

// Defines some basic variables
let anchorsArray = ["startpagina.nl"]; // Define the start if required
// Starts crawling
function round() {
   if(anchorsArray.length >= 1) {
      let randomAnchorIndex = Math.floor(Math.random() * anchorsArray.length);
      let url = anchorsArray[randomAnchorIndex];
      fancyLog(`Processing: ${url}`);
      crawl(url, function (status, anchors) {
         if(status) {
            fancyLog(`Processed: ${url}, links: ${anchors.length}`);
            // Sets the anchors array, and the new index
            anchors.forEach(function (anchor) {
               anchorsArray.push(anchor);
            });
            // Does the new round
            anchorsArray.splice(randomAnchorIndex, 1);
            setTimeout(function () {
               round();
            }, 100)
         } else {
            fancyLog(`Url could not be used: ${url}`);
            anchorsArray.splice(randomAnchorIndex, 1);
            setTimeout(function () {
               round();
            }, 100)
         }
      });
   } else {
      fancyLog("Crawl complete.");
   }
}

function fancyLog(text) {
   console.log(`DEBUG@${Date.now()}: ${text}`);
}

function intoLog(message) {
   console.log("\n\n");
   console.log(generateCharstring("=", 64));
   console.log(message);
   out = "";
   for(let i = 0; i < 64; i++) {
      out += "=";
   }
   console.log(generateCharstring("=", 64));
   console.log(`Current date: ${new Date().toDateString()}`);
   console.log(generateCharstring("=", 64));
   console.log("\n\n");
}
// Generates the character string
function generateCharstring(char, length) {
   let out = "";
   for(let i = 0; i < length; i++) {
      out += char;
   }
   return out;
}
intoLog("LukeCrawler booting.... Please be patient.\nThe crawling will start as soon as everything is initialized.");
round();
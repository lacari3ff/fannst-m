/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
// The functions
function onData(stream, session, callback) {
    let body = "";
    // On data listener
    stream.on("data", function(chunk) {
        body += chunk;
    });
    // On the end of the data stream
    stream.on("close", function() {
       console.log(body);
       callback(null, "Message queued.");
    });
}
// Exports
module.exports = onData;
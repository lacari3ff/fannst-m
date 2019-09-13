/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
// The modules
const SMTPServer = require("smtp-server").SMTPServer;
// The source files
const onAuth = require("./src/email/on-auth");
const onData = require("./src/email/on-data");
// Creates the src server
const server = new SMTPServer({
    secure: false,
    authOptional: true,
    authMethods: ["PLAIN"],
    onAuth(auth, session, callback) {
        onAuth(auth, session, callback);
    },
    onMailFrom(address, session, callback) {
        return callback();
    },
    onRcptTo(address, session, callback) {
        if(address.address.in)
        return callback();
    },
    onData(stream, session, callback) {
        onData(stream, session, callback);
    },
    onConnect(session, callback) {
        return callback();
    }
});
// Listens the server
server.listen(25);
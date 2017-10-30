var express = require('express');
var router = express.Router();

module.exports = function (io) {

    router.get('/', function (req, res) {
        req.logout();
        req.session.destroy();
        req.session = null;
        res.send('{"message": "singout","status": "ok"}');
        for (var i in io.sockets.connected) {
            if (io.sockets.connected[i].handshake.session.hasOwnProperty('passport')) {
                console.log(io.sockets.connected[i].handshake.session.passport.user);
            }
        }
    });

    return router;
};



/**
 * Created by skolos on 27.07.2017.
 */
var express = require('express');
var router = express.Router();

module.exports = function (passport, io) {

    router.get('/', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            if (err) { return res.send('{"status":"failed","error":"'+err+'"}'); }
            if (!user) { return res.send('{"status":"failed","error":"Login or password is incorrect"}'); }
            req.login(user, function(err) {
                if (err) { res.send('{"status":"failed","error":"'+err+'"}'); }
                // for (var i in io.sockets.connected.handshake.session) {
                //     if (io.sockets.connected[i].handshake.session.hasOwnProperty('passport')) {
                //         console.log(io.sockets.connected[i].handshake.session);
                //     }
                // }
                req.session.save();
                return res.send('{"status":"ok","user":'+JSON.stringify(user)+'}');
            });
        })(req, res, next);
    });

    return router;
};

var express = require('express');
var router = express.Router();

module.exports = function (passport) {


    /* Handle Registration POST */
    // router.post('/', function(req, res, next) {
    //     passport.authenticate('signup', function(err, user, info) {
    //             res.send('{"user": user,"status": "ok"}');
    //         }
    //     )
    // });

    router.post('/', function(req, res, next) {
        passport.authenticate('signup', function(err, user, info) {
            if (err) { return res.send('{"status":"failed","error":"'+err+'"}'); }
            if (!user) { return res.send('{"status":"failed","error":"Enter another username"}'); }
            req.logIn(user, function(err) {
                if (err) { res.send('{"status":"failed","error":"'+err+'"}'); }
                return res.send('{"status":"ok","user":"'+user+'"}');
            });
        })(req, res, next);
    });


    return router;
};



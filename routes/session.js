/**
 * Created by skolos on 27.07.2017.
 */
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../passport/isauth').isAuthenticated;

module.exports = function () {

    /* verify user session */
    router.get('/', isAuthenticated, function (req, res) {
        return res.send('{"status":"ok","user":'+JSON.stringify(req.user)+'}');
    });

    return router;
};



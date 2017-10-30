var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isAuthenticated = require('../passport/isauth').isAuthenticated;

module.exports = function () {

    /* POST Edit User */
    router.post('/', isAuthenticated, function (req, res) {

        var user = {};

        if (req.body.username || req.body.password ) {
            //new user info
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
        }

            User.findOneAndUpdate({'_id': req.user.id}, user, {upsert: true}, function (err, user) {

                if (err) {
                    console.log('Error in Saving user: ' + err);
                    throw err;
                }

                res.redirect('/');
            });
    });


    return router;
};



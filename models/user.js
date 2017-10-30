/**
 * Created by skolos on 19.07.2017.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    rating: String,
    token: String
});
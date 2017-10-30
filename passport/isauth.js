/**
 * Created by skolos on 22.03.2017.
 */
module.exports.isAuthenticated = function (req, res, next) {

    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.send('{"status":"0","message":"user not authorised"}');
};

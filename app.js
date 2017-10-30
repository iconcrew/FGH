var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');


var clients = {};

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);
db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting with mongodb database:'));

db.once('open', function() {
    console.log('connected to mongodb database');
});

db.on('disconnected', function () {
    //Reconnect on timeout
    mongoose.connect(dbConfig.url);
    db = mongoose.connection;
});


module.exports = function (app, io) {

    function removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    function objSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }


// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Configuring Passport
    var passport = require('passport');
    var expressSession = require('express-session');
    var MongoStore = require('connect-mongo')(expressSession);
    app.use(expressSession({
        unset: 'destroy',
        secret: 'g435kv823G-sv',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            url : dbConfig.url,
            db : "memechick",
            collection : 'session'
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    // var sharedSession = require("express-socket.io-session");
    // io.use(sharedSession(expressSession, {
    //     autoSave:true
    // }));



    // Initialize Passport
    var initPassport = require('./passport/init');
    initPassport(passport);


    app.use('/', index);

    //Login
    var login = require('./routes/login')(passport, io);
    app.use('/login', login);

    //Check session on matchmaking
    var session = require('./routes/session')(passport, io);
    app.use('/session', session);

    //Sign In
    var signup = require('./routes/signup')(passport);
    app.use('/signup', signup);

    //Sign out
    var signout = require('./routes/signout')(io);
    app.use('/signout', signout);



// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    function searchMatch(id, io, sockId) {
        var partnerId = "";
        for (var i in io.sockets.connected) {
            if (io.sockets.connected[i].id != id && io.sockets.connected[i].searching == true) {

                partnerId = io.sockets.connected[i].id;
                socket.join('some room');

                break;
            }
        }
        return partnerId;
    }

};


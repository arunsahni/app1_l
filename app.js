var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./config/passport_config.js');
var db = require('./config/db.js');
var jwt = require('jwt-simple');
var fs = require('fs');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.engine('html', function (path, opt, fn) {
    fs.readFile(path, 'utf-8', function (err, str) {
        if (err)
            return str;
        return fn(null, str);
    });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Use the passport package in our application
app.use(passport.initialize());
app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/admin', function (req, res) {
    res.render('admin.html');
});

app.get('/tutor', function (req, res) {
    res.render('tutor.html');
});

require('./routes/staff')(app, express,passport);
require('./routes/learner')(app, express,passport);
require('./routes/tutor')(app, express,passport);
require('./routes/staticpages')(app, express,passport);
require('./routes/announcements')(app, express,passport);
require('./routes/institutions')(app, express,passport);
require('./routes/subjects')(app, express,passport);
require('./routes/blogs')(app, express,passport);
require('./routes/teachingareas')(app, express,passport);
require('./routes/teachingexperts')(app, express,passport);
require('./routes/badges')(app, express,passport);

require('./routes/banks')(app, express,passport);
require('./routes/certificates')(app, express,passport);
require('./routes/locations')(app, express,passport);

require('./routes/auth')(app, express,passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// 
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

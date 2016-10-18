'use strict'
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
var _ = require('underscore');
var Promise = require('bluebird');
var url = require('./url');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



_.each(urls, function (u) {
    app[u.method](u.path, function (req, res, next) {
        return Promise.try(_.partial(delayFn(u.delay))).then(_.partial(randomFn(u.random))).then(function (data) {
            return res.status(data.code|| 200).send(data.value);
        }).catch(function (err) {
            return res.status(err.code || 400).send(err.message)
        });
    });
});

function delayFn(val, data) {

    if(_.isFunction(val)) {
        return new Promise(function () {
            return val(data);
        }); // execute the function and return the promise
    }

    if(val == null || _.isUndefined(val) || parseInt(val, 10) === NaN) {
        return Promise.return({}); // return null promise
    }

    return Promise.delay(val).return({}); // delay
}


function randomFn(rVal, data) {
    if(_.isFunction(rVal)) {
        return new Promise(function () {
            return val(data);
        }); // execute the function and return the promise
    }
    if(rVal === true) {
        data.code = _.sample([200,201,202, 204, 301, 302, 400,401, 402, 403, 404, 405, 406, 408, 409, 410, 412, 413, 415, 417, 418, 422, 428, 500, 501, 502, 503, 504, 505]);
    }
    if(_.isNumber(rVal)) {
        data.code = rVal;
    }
    return data;
}


module.exports = app;

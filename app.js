'use strict'
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var routes = require('./routes/index');

var app = express();
var _ = require('underscore');
var Promise = require('bluebird');


Promise.config({
    longStackTraces: true,
    warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
})
var request = require("request");

var urls = require('./urls');
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


_.each(urls, function (u) {
    var methods = _.flatten([u.methods || u.method ||  ['get', 'post', 'delete', 'put']]);
    _.each(methods, function (method) {
        console.log("Registering  path:"+ u.path +" for method "+ method + "  to proxy " + u.proxy);
        app[method](u.path, function (req, res, next) {
            console.log("Invoked method "+ method + " on "+ u.path);
            return Promise.try(_.partial(delayFn, u.delay)).then(_.partial(proxy, method, u.proxy, req)).then(_.partial(randomFn, u.random)).then(function (data) {
//                console.log("processed", data);
                var proxyResponse = data.res;
                console.log(proxyResponse.headers);
                _.each(proxyResponse.headers, function (value, header) {
                    res.set(header, value);
                });

                return res.status(data.code|| proxyResponse.statusCode).send(data.body);
            }).catch(function (err) {
                console.log(err);
                console.log(err.stacktrace);
                return res.status(err.code || 500).send(err.message)
            });
        });

    });
});



//console.log(app._router.stack);


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


function proxy(method, url, req, data) {
    if(!_.isEmpty(req.params)) {
        _.each(req.params, function (value, key) {
            url = url.replace(":"+key, value);
        })
    }
    return new Promise(function (resolve, reject) {
        var reqOptions = {url: url, method: method, headers: req.headers };
        if(!_.isEmpty(req.query)) {
            _.extend(reqOptions, {qs: req.query});
        }
        return request(reqOptions, function(err, res, body) {
            if(err){
                console.log("called downstream, failed", err);
                return reject(err);
            }
            data.res = res;
            data.body = body;
            return resolve(data);
        });
    });
}

function delayFn(val, data) {
    if(val == null ||val== false || _.isUndefined(val) || parseInt(val, 10) === NaN) {
        console.log("there is no delay");
        return Promise.resolve(data || {}); // return null promise
    }

    if(_.isFunction(val)) {
        val = val.apply(null, [data]);
    }

    console.log("Delaying by "+ val);
    return Promise.delay(val).return(data || {});
}


function randomFn(rVal, data) {
    if(_.isFunction(rVal)) {
        rVal =  rVal.apply(null, [data]);
    }
    if(rVal === true) {
        data.code = _.sample([200,201,202, 204, 301, 302, 400,401, 402, 403, 404, 405, 406, 408, 409, 410, 412, 413, 415, 417, 418, 422, 428, 500, 501, 502, 503, 504, 505]);
        console.log("Setting return code to "+ data.code);
    }
    if(_.isNumber(rVal)) {
        console.log("Setting return code to "+ rval);
        data.code = rVal;
    }
    return data;
}


module.exports = app;

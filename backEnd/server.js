// server.js

// BASE SETUP
// ==============================================

var express = require('express');
var app     = express();
var mongoose = require('mongoose');
var winston = require('winston');
var router = require('./1-app/routes');
var logger = require('./2-service/logger');
var port    =   process.env.PORT || 3000;


// ROUTES
// ==============================================
// apply the routes to our application /api
app.use('/api', router);

// ERROR HANDLING
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500);
});

//Connect to DB
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    mongoose.connect('mongodb://127.0.0.1/visits', function onMongooseError(err) {
        if(err)
            logger.error("Error connecting to DEV DB " + err);
    });
}

if ('test' == env) {
    console.log('test env connection mongo');
    mongoose.connect('mongodb://127.0.0.1/test_visits', function onMongooseError(err) {
       if(err)
           logger.error("Error connecting to test DB " + err);
        
    });
}

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
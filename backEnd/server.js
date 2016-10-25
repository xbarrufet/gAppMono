// server.js

// BASE SETUP
// ==============================================

var express = require('express');
var swagger = require("swagger-node-express");
var app     = express();


var router = require('./1-app/routes');
//var eventRoutes = require('./1-app/eventRoutes');

var logger = require('./2-service/logger');
var bodyParser = require('body-parser');
var database = require('./5-Infrastructure/database')
var eventQueue = require('./5-Infrastructure/eventQueue')

var specialTaskService    = require('./2-service/specialTaskFlowService');
var CTE    = require('./4-helpers/constants');

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//swagger ui
var subpath = express();
app.use("/v1", subpath);
swagger.setAppHandler(subpath);
app.use(express.static('dist'));


// ERROR HANDLING
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500);
});


// ROUTES
// ==============================================
// apply the routes to our application /api
app.use('/api', router);


//Connect to DB
database.connect()
    .fail(function(err) {
        console.error(err.stack)
    })

/*//connect to rabbit
eventQueue.connect()
    .then(function() {
        eventRoutes.addListeners();
    })
    .fail(function(err) {
    console.error(err.stack)
})*/

// START THE SERVER
// ==============================================
var port    =   process.env.PORT || 3000;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
console.log('Magic happens on port ' + port);

module.exports = server
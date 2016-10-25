/**
 * Created by xavierbarrufet on 2/5/16.
 */

var mongoose = require('mongoose');
var logger = require('../2-service/logger');
var Q = require('Q');


var database = function() {
    var _connect=function()
    {
        var deferred = Q.defer();
        var env = process.env.NODE_ENV || 'development';
        var connection_string ="";

        if ('development' == env)
            connection_string='mongodb://127.0.0.1/dev_gAppMono';
        if ('test' == env)
            connection_string='mongodb://127.0.0.1/test_gAppMono';
        if(connection_string.length>0  ) {
            console.log("******* mongoose.connection.readyState:"+ mongoose.connection.readyState)
            if(mongoose.connection.readyState!=1) {
                mongoose.connect(connection_string, function onMongooseError(err) {
                    if (err)
                        deferred.reject(err)
                    deferred.resolve();
                })
            } else {
                deferred.resolve();
            };
        } else {
            return deferred.reject("No environment defined")
        }
        return deferred.promise;
    }

    return {
        connect:_connect
    }
}()

module.exports=database
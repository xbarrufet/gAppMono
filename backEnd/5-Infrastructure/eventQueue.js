/**
 * Created by xavierbarrufet on 2/5/16.

var amqp = require('amqplib/callback_api');
var CTE=require('../4-helpers/constants')
var Q = require('Q');
var async=require("async")

var channel;




var eventQueue=function() {
    var _connect=function() {
        var deferred = Q.defer();
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                if(err)
                    deferred.reject(err);
                var channel = ch;
                channel.assertExchange(CTE.EVENTS_EXCHANGE, 'topic', {durable: false});
                channel.assertExchange(CTE.EVENTS_ERROR_EXCHANGE, 'topic', {durable: false});
                deferred.resolve();
            })
        })
        return deferred.promise;
    }

    var emitEvent=function(event,body) {
        var msg ={eventType:event,body:body};
        ch.publish(CTE.EVENTS_EXCHANGE, event, new Buffer(msg));
    }

    var emitErrorEvent=function(error,oldEvent) {
        var msg=oldEvent
        msg.error=error;
        ch.publish(CTE.EVENTS_ERROR_EXCHANGE, oldEvent.eventType, new Buffer(msg));
    }

    var _addListener=function(topic,listener) {
        var deferred = Q.defer();
        async.retry({times: 3, interval: 200},function(callback,result) {
           channel.assertQueue('', {exclusive: true}, function (err, q) {
               if (err)
                   callback(err,null)
               channel.bindQueue(q.queue, CTE.EVENTS_EXCHANGE, topic);
               channel.consume(q.queue, listener, {noAck: true});
               callback(null,"");
           })
        },function(err,result) {
          if(err)
              deferred.reject(err)
           deferred.resolve(result);
        })
        return deferred.promise;
    }

    return {
        connect:_connect(),
        addListener:_addListener
    }

}();

module.exports=eventQueue

 */
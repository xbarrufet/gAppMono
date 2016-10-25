/**
 * Created by xavierbarrufet on 6/5/16.
 */


var Q = require('Q');

var timers = [1000,2000,3500,1100];


function run(timers) {
    var promises =[];
    timers.forEach(function(f) {
        promises.push(timeOut(f));
    })
    return Q.all(promises)
}

function timeOut(value) {
    var deferred = Q.defer();
    setTimeout(function () {
                console.log("time Out:" + value)
                deferred.resolve(value/1000);
    }, value)
    return deferred.promise;
}

run(timers).then(function(val) {
    console.log("end process");
    console.log(val);
})
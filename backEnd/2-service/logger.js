/**
 * Created by xavierbarrufet on 18/4/16.
 */
var winston=require("winston");

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'backEndgAppMono.log' })
    ]
});

function metadata(module,funcName) {
    var res ={};
    res.timestamp = new Date();
    res.module=module;
    res.funcName=funcName;
    return res;
}



var logger = function() {

    var _info=function(msg,module,funcName) {
        log.info('info',msg,metadata(module,funcName));
    };
    var _debug=function(msg,module,funcName) {
        log.debug('debug',msg,metadata(module,funcName));
    };
    var _error=function(msg,module,funcName) {
        log.error('error',msg,metadata(module,funcName));
    };

    return {
        info: _info,
        debug: _debug,
        error: _error
    }
}();

module.exports = logger;


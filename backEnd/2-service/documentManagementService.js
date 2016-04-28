var logger = require('../2-service/logger');
var documentRepository = require('../2-service/documentRepository');
var fs=require("fs")
var Q = require('Q');





var documentManagementService = function() {
    
    var _putFileFromPath= function(path,contentType,metadata) {
       var deferred = Q.defer();
       logger.debug("start path=" + path,"documentManagementService","_putFileFromPath");
       documentRepository.putFile(    fs.readFileSync(path),contentType,metadata,function(err,doc) {
            if (err) {
                logger.error(err, "documentManagementService", "_putFileFromPath");
                deferred.reject(err);
            }
            deferred.resolve(doc.id);
        });
    }
    
    var _putFileFromStream= function(stream,contentType,metadataHash) {
       var deferred = Q.defer();
       logger.debug("start","documentManagementService","_putFileFromStream");
       documentRepository.putFile(   stream,contentType,metadata,function(err,doc) {
            if (err) {
                logger.error(err, "documentManagementService", "_putFileFromStream");
                deferred.reject(err);
            }
            deferred.resolve(doc.id);
        });
    }
    
    var _getFile= function(fileId) {
        var deferred = Q.defer();
        logger.debug("start fileId=" + fileId,"documentManagementService","_getFile");
         documentRepository.getFile(fileId, function (err,doc) {
            if (err) {
                logger.error(err, "documentManagementService", "_getFile");
                deferred.reject(err);
            }
            deferred.resolve(doc);
        });
    }
    
        
    
return {
    putFileFromPath:_putFileFromPath,
    getFile:_getFile    
}

}()

moddule.exports=documentManagementService
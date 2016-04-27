var logger = require('../2-service/logger');
var fs = require('fs');


var documentRepository = function() {
        
    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;
 
    var _documentSchema = new Schema({
        data: Buffer, type: String. gardeId:String 
    })
    var _model = mongoose.model('Document', _documentSchema);
    
    var _putFile=function(path,type,gardenId,callback) {
         var doc =({
            type: type,
            gardenid: gardenId,
            data: fs.readFileSync(path)
        });
        _model.create(doc,
            function (err, vDoc) {
                if(err) {
                    logger.error(err,"documentRepository","_putFile");
                    callback(err,null);
                    return;
                }
                callback(null,vDoc)
            });
        return;
    }
    
    var _getFile=function(fileId,callback) {
        logger.info("start","documentRepository","_getFile");
        _model.findById(fileId,function(err,doc) {
            if(err) {
                logger.error(err,"userRepository","_getAllUsers");
               callback(err,null);
                return;
            }
            callback(null,doc)
        });
        return;
    }
    
    
return {
 
    putFile:_putFile,
    getFile:_getFile
}
}();

module.exports = documentRepository;
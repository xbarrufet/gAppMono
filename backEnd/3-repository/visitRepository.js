var logger = require('../2-service/logger');


var visitRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;


   
    var _closedVisitsSchema = new Schema({
        gardenId:{ type : String , required : true},        
        startTime: { type : Date ,  required : true},
        endTime: { type : Date ,  required : true},        
        visitType: { type : String, required : true , default:"SERVICE"},        
        content: {
                taskId:String,
                conversationId:String,
                images:[String],
                services:[String],
                description:String
        }
    });

    var _model = mongoose.model('ClosedVisits', _closedVisitsSchema);

    var _getClosedVisits = function(gardenId,callback) {
        logger.info("start","visitRepository","_getClosedVisits");
        _model.find({gardenId:gardenId},function(err,docs) {
            if(err) {
                logger.error(err,"visitRepository","_getClosedVisits");
               callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

   

   
    var _addClosedVisit = function(newClosedVisit,callback) {
        logger.info("start","visitRepository","_addClosedVisit");
        var user =({
                gardenId:newClosedVisit.gardenId,                
                startTime: newClosedVisit.startTime,
                endTime: newClosedVisit.endTime,
                visitType: newClosedVisit.visitType,
                content: {
                    taskId:newClosedVisit.content.taskId,
                    
                }
        });
        if(newClosedVisit.content.images!=null)
            user.content.images=newClosedVisit.content.images;
        if(newClosedVisit.content.conversationId!=null)
            user.content.conversationId=newClosedVisit.content.conversationId;
        if(newClosedVisit.content.services!=null)
            user.content.services=newClosedVisit.content.services;
        if(newClosedVisit.content.description!=null)
            user.content.description=newClosedVisit.content.description;
        _model.create(user,
            function (err, vUser) {
                if(err) {
                    logger.error(err,"visitRepository","_addUser");
                    callback(err,null);
                    return;
                }
                callback(null,vUser)
            });
        return;
    };

    


    return {
        getVisits: _getVisits,
        getUserById:_getUserById,
        getUserByEmail:_getUserByEmail,
        deleteUser:_deleteUser,
        addUser:_addUser,
        validate: _validate,

        closedVisitsSchema: _closedVisitsSchema,
        model: _model,
        TYPE_CLIENT:TYPE_CLIENT,
        TYPE_GARDEN:TYPE_GARDEN
    }
}();

module.exports = visitRepository;

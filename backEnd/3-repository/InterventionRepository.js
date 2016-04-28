var logger = require('../2-service/logger');
var Q = require('Q');

var interventionRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;

    var TYPE_REGULAR="REGULAR"
    var TYPE_SPECIAL="SPECIAL"
   
    //es guarda una intervencio per visita i tipus de servei
    // servei regular: 
    // servei especial
    
    var _interventionSchema = new Schema({
        gardenId:{ type : String , required : true},        
        startTime: { type : Date ,  required : true},
        endTime: { type : Date ,  required : true},        
        interventionType: { type : String, required : true , default:TYPE_REGULAR},                
        conversationId:String,
        tasks: {[
                taskId:String,
                taskType:String,                
                description:String,
                images:[String]
                  ]}
    });

    var _model = mongoose.model('Intervention', _interventionSchema);

    var _getInterventions = function(gardenId,callback) {
        logger.info("start","interventionRepository","_getClosedVisits");
        _model.find({gardenId:gardenId},function(err,docs) {
            if(err) {
                logger.error(err,"interventionRepository","_getClosedVisits");
               callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

   

   
    var _addIntervention = function(newIntervention) {
        var deferred = Q.defer();
        logger.info("start","interventionRepository","_addClosedVisit");
        var user =({
                gardenId:newIntervention.gardenId,                
                startTime: newIntervention.startTime,
                endTime: newIntervention.endTime,
                interventionType: newIntervention.visitType,                
                conversationId:newIntervention.conversationId,
                tasks:newIntervention.tasks                                    
        });
                
        _model.create(user,
            function (err, vIntervention) {
                if(err) {
                    logger.error(err,"interventionRepository","_addIntervention");
                   deferred.reject(err)
                }
                deferred.resolve(vIntervention)
            });
        return deferred.promise
    };
    
    var _deleteIntervention = function(interventionId) {
        var deferred = Q.defer();
        logger.info("start internventionId=" + internventionId,"interventionRepository","_deleteIntervention");
         _model.findOneAndRemove({id:interventionId},function(err,doc) {
                if(err) {
                    logger.error(err,"interventionRepository","_deleteIntervention");             
                   deferred.reject(err)
                }
                deferred.resolve(vIntervention)                
         }
         return deferred.promise;
    }

    return {
        getInterventions: _getInterventions,
        deleteIntervention:_deleteIntervention,
        addIntervention:_addIntervention
        schema: _interventionSchema,
        model: _model
    }
}();

module.exports = interventionRepository;

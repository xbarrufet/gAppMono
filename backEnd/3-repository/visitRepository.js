/**
 * Created by xavierbarrufet on 6/5/16.
 */
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
mongoose.Promise = require('Q').Promise;


var visitRepository = function() {

    var _visitSchema=new Schema({
        gardenCenterId:{type: Schema.Types.ObjectId, required: true},
        gardenId:{type: Schema.Types.ObjectId, required: true},
        scheduleId:{type: Schema.Types.ObjectId, required: true,ref:"Schedule"},
        startDate:{type: Date, required: true},
        endDate:{type: Date, required: false},
        status:{type: String, required: true},
        client: {
            clientId:{type: Schema.Types.ObjectId, required: true},
            name:{type: String, required: true},
        },
        garden:{
            gardenId: {type: Schema.Types.ObjectId, required: true},
            gardenAddress: {
                address: {type: String, required: false},
                city: {type: String, required: false},
                province: {type: String, required: false},
                PO: {type: String, required: false}
            },
        },
        tasks: [{
            taskId:String,
            taskType:String,
            topic:String,
            description:String,
            taskStatus:String,
            files:[{type: Schema.Types.ObjectId, required: false}],
            conversation: {
                comments: [{
                    userId: {type: Schema.Types.ObjectId, required: true},
                    text: String,
                    commentType: {type: String, required: true},
                    files: [{fileId:String,mimeType:String}],
                    timeStamp: {type: Date, required: true}
                }]
            }
        }]
    })


    var _model = mongoose.model('Visit', _visitSchema);


    var _getVisitsByTaskId = function (taskId) {
        logger.info("start","scheduleRepository","_getVisitsByTaskId");
        return _model.findOne({'tasks.taskId':taskId}).exec()
    }

    var _getVisitById = function (gardenCenterId,visitId) {
        logger.info("start","scheduleRepository","_getVisitsByTaskId");
        return _model.findOne({_id:visitId,gardenCenterId:gardenCenterId}).exec()
    }


    var _getClosedVisitsByGardenId = function (gardendId) {
        logger.info("start","scheduleRepository","_getScheduleByGardenId");
        return _model.find({gardenId:gardenId,status:CTE.VISIT_STATUS_CLOSED}).exec();
    }



    var _addVisit=function(visit) {
        var deferred=Q.defer();
        logger.info("start","scheduleRepository","_addScheduledService");
         _model.create(visit,function(err, vVisit) {
           if(err)
               deferred.reject(err);
          deferred.resolve(vVisit);
         })
        return deferred.promise;
    }

    var _updateVisitTaskStatus = function(gardenCenterId,taskId,newStatus) {
        logger.info("start","scheduleRepository","_updateVisitTaskStatus");
        return _model.findOneAndUpdate({gardenCenterId:gardenCenterId,'tasks._id':taskId},{ "tasks.$.taskStatus" : newStatus },{new: true}).exec();
    }

    var _updateVisitStatus = function(visitId,newStatus) {
        logger.info("start visitId="+visitId,"scheduleRepository","_updateVisitStatus");
        return _model.findByIdAndUpdate(visitId,{ "status" : newStatus }).exec();
    }



    var _deleteVisit=function(visitId) {
       return _model.findByIdAndRemove(visitId).exec();
    }

    var _upadateVisit=function(visit) {
        logger.info("start","scheduleRepository","_upadteVisit");
        return visit.save();
    }

    return {
        getVisitById:_getVisitById,
        getVisitsByTaskId:_getVisitsByTaskId,
        getClosedVisitsByGardenId:_getClosedVisitsByGardenId,
        updateVisitTaskStatus:_updateVisitTaskStatus,
        addVisit:_addVisit,
        updateVisitStatus:_updateVisitStatus,
        deleteVisit:_deleteVisit,
        upadateVisit:_upadateVisit,
        schema: _visitSchema,
        model: _model
    }
}();

module.exports = visitRepository;



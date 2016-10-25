/**
 * Created by xavierbarrufet on 6/5/16.
 */
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');


var TYPE_REGULAR="REGULAR"
var TYPE_SPECIAL="SPECIAL"

//es guarda una intervencio per visita i tipus de servei
// servei regular:
// servei especial


var scheduleRepository = function() {



    var _scheduleSchema = new Schema({
        gardenCenterId:{type: Schema.Types.ObjectId, required: true},
        date:{type: Date, required: true},
        startPeriod:{type: Date, required: true},
        endPeriod:{type: Date, required: true},
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
            conversation: {
                comments: [{
                    userId: {type: Schema.Types.ObjectId, required: true},
                    text: String,
                    commentType: {type: String, required: true},
                    files: [{fileId:String,mimeType:String}],
                    timeStamp: {type: Date, required: true}
                }]
            }
        }],
        visits:[{type: Schema.Types.ObjectId, required: false,ref:"Visit"}]
    });

    var _model = mongoose.model('Schedule', _scheduleSchema);

    var _modelClosed = mongoose.model('CloseSchedule', _scheduleSchema);




    var _getSchedule = function(gardenCenterId) {
    logger.info("start","scheduleRepository","_getSchedule");
    return _model.find({gardenCenterId:gardenCenterId}).exec();
};

    var _getScheduleByGardenId = function(gardenCenterId,gardenId) {
        logger.info("start","scheduleRepository","_getScheduleByGardenId");
        return _model.findOne({gardenCenterId:gardenCenterId,"garden.gardenId":gardenId}).exec();
    };
    

    var _updateScheduleVisits=function(scheduleId,visits) {
        logger.info("start","scheduleRepository","_updateTaskStatus");
            return _model.findByIdAndUpdate(scheduleId,{ "visits" : visits },{new: true}).exec();
    }

    var _addScheduleBackup=function(schedule) {
        var deferred=Q.defer();
        _modelClosed.create(schedule,
            function (err, vSchedule) {
                if(err) {
                    deferred.reject(err)
                }
                _model.re
               deferred.resolve(schedule.id)
            });
        return deferred.promise;
    }

    var _backupSchedule= function(gardenCenterId) {
        var deferred = Q.defer();
        logger.info("start", "scheduleRepository", "_addScheduledService");
        _getSchedule(gardenCenterId)
            .then(function (docs) {
                var promises = [];
                docs.forEach(function (schedule) {
                    promises.push(_addScheduleBackup(schedule))
                })
                return Q.all(promises)
            }).then(function (val) {
                        deferred.resolve(true)
            }).fail(function(err) {
                deferred.reject(err)
        });
        return deferred.promise;
    }

    var _addScheduledService = function(schedule,callback) {
        logger.info("start","scheduleRepository","_addScheduledService");
        _model.create(schedule,
            function (err, vIntervention) {
                if(err) {
                    logger.error(err,"scheduleRepository","_addScheduledService");
                    callback(err,null);
                    return;
                }
                callback(null,vIntervention)
            });
        return;
    };


    var _updateTaskStatus = function(taskId,newStatus,callback) {
        logger.info("start","scheduleRepository","_updateTaskStatus");
        _model.findOneAndUpdate({'tasks.taskId':taskId},{ "tasks.$.taskStatus" : newStatus },{new: true}
                                ,function(err,schedule) {
            if(err) {
                logger.error(err,"scheduleRepository","_getSchedule");
                callback(err,null);
                return;
            }
            callback(null,schedule)
        });
        return;

    }



    return {
        addScheduledService: _addScheduledService,
        getSchedule:_getSchedule,
        getScheduleByGardenId:_getScheduleByGardenId,
        updateTaskStatus:_updateTaskStatus,
        updateScheduleVisits:_updateScheduleVisits,
        backupSchedule:_backupSchedule,
        schema: _scheduleSchema,
        model: _model
    }
}();

module.exports = scheduleRepository;


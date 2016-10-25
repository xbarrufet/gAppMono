/**
 * Created by xavierbarrufet on 6/5/16.
 */
var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var scheduleService = require("../2-service/scheduleService");
var visitRepository = require("../3-repository/visitRepository");
var DMS =require("../2-service/documentManagementService")
var specialTaskService = require('../2-service/specialTaskFlowService');
var tools = require('../8-tools/tools')


function buildVisit(schedule,startDate) {
    var res = {
        gardenCenterId: schedule.gardenCenterId,
        gardenId: schedule.garden.gardenId,
        scheduleId: schedule.id,
        startDate: startDate,
        status: CTE.VISIT_STATUS_INPROGRESS,
        client: schedule.client,
        garden: schedule.garden,
        tasks:[]
    }
    //take only the pending tasks
    schedule.tasks.forEach(function(task) {
        if(task.taskStatus==CTE.TASK_READY)
            res.tasks.push(task)
    })
    return res;
}


var visitService = function() {

    var _createVisitFromSchedule=function(gardenCenterId,gardenId,user,startDate) {
        //get schedule
        var deferred = Q.defer();
        var schedule,visit;
        scheduleService.getScheduleByGardenId(gardenCenterId,gardenId)
            .then(function(vSchedule) {
                schedule=vSchedule;
                var visit = buildVisit(schedule, startDate);
                return visitRepository.addVisit(visit)
            }).then(function(vVisit) {
                visit=vVisit;
                schedule.visits.push(visit._id);
                return scheduleService.updateScheduleVisits(schedule.id, schedule.visits)
            }).then(function(doc) {
                deferred.resolve(visit);
            }).fail(function(err){
                if(visit!=undefined)
                    visitRepository.deleteVisit(visit.id)
                deferred.reject(err)
        })
        return deferred.promise;
    }


    var _closeVisit=function(gardenCenterId,visitId,endTime) {
        var deferred = Q.defer();
        visitRepository.getVisitById(gardenCenterId,visitId)
            .then(function(visit) {
                visit.status = CTE.VISIT_STATUS_CLOSED;
                for (t = 0; t < visit.tasks.length; t++) {
                    if (visit.tasks[t].taskStatus == CTE.TASK_READY) 
                        visit.tasks[t].taskStatus = CTE.TASK_SKIP;
                }
                return visitRepository.upadateVisit(visit)
            }).then(function(visit) {
                deferred.resolve(visit);
            }).fail(function(err) {
                deferred.reject(err);
        })
        return deferred.promise;
    }

    var _completeVisitTaskStatus=function(gardenCenterId,visitId,taskId) {
        return visitRepository.updateVisitTaskStatus(gardenCenterId,taskId,CTE.TASK_DONE);
    }

    var _notApplicableVisitTaskStatus=function(gardenCenterId,visitId,taskId) {
        var deferred = Q.defer();
        return visitRepository.updateVisitTaskStatus(gardenCenterId,taskId,CTE.TASK_NA);
    }

    var _addFiletoTask = function(gardenCenterId,taskId,filePath,mimeType,userId) {
        var deferred = Q.defer();
        logger.debug("start taskId="+ taskId, "conversationService","_addFiletoTask");
        // /store file in DMS
        var cId = conversationId;
        DMS.putFileFromPath(filePath)
            .then(function(doc) {
                visitRepository.getVisitsByTaskId(taskId,function(err,visit) {
                    if(err)
                        deferred.reject(err)
                    visit.files.push({fileId:doc.id,mimeType:mimeType})
                    return visitRepository.upadateVisit(visit);
                })
                
        }).fail(function(err) {
            deferred.reject(err)
        })
        return deferred.promise;
    }


    return {
        createVisitFromSchedule:_createVisitFromSchedule,
        closeVisit:_closeVisit,
        completeVisitTaskStatus:_completeVisitTaskStatus,
        notApplicableVisitTaskStatus:_notApplicableVisitTaskStatus
    }

}()

module.exports = visitService;


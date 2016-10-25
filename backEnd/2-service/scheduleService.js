/**
 * Created by xavierbarrufet on 6/5/16.
 */
var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var scheduleRepository = require("../3-repository/scheduleRepository");
var clientGardenService = require("../2-service/clientGardenService");
var specialTaskFlowService = require("../2-service/specialTaskFlowService");
var DMS =require("../2-service/documentManagementService")
var tools = require('../8-tools/tools')




function getSpecialTasks(client) {
    var deferred = Q.defer();
    var promises = [];
    var result ={clientData:client,gardens:[]};
    client.gardens.forEach(function (item) {
        var garden=item;
        //kepp address to facilitate visualization
       if (garden.gardenAddress.address == null)
            garden.gardenAddress = client.clientAddress;
        //prepare promises array
        promises.push( specialTaskFlowService.getSpecialTaskByStatus(garden.id, CTE.TASK_READY));
        //set garden in resukt
        result.gardens.push(garden);
    });
    Q.all(promises)
        .then(function(values) {
                for(t=0;t<values.length;t++)
                    result.gardens[t].tasks=values[t];
            deferred.resolve(result)
        }).fail(function (err) {
            deferred.reject(err);
        })
    return deferred.promise;
}

function getGardenInformation(gardenCenterId) {
    var deferred = Q.defer();
    //get all gardens form gardenCenter
    var clientList;
    var schedule=[];
    clientGardenService.getClientsByGardenCenter(gardenCenterId)
        .then(function(clients) {
            clientList=clients;
            var promises=[];
            clients.forEach(function(cl) {
                promises.push(getSpecialTasks(cl));
            });
            Q.all(promises)
                .then(function (values) {
                    deferred.resolve(values);
                }).fail(function(err) {
                deferred.reject(err);
            })
        })
        .fail(function(err) {
            deferred.reject(err)
        })
    return deferred.promise;
}


function createScheduleEntries(gardenCenterId,startPeriodDate,endPeridDate,clients) {
    var result = [];
    clients.forEach(function (client) {
        client.gardens.forEach(function (garden) {
            if (garden.serviceType == CTE.GARDEN_SERVICE_TYPE_SCHEDULED) {
                var schedule = {
                    gardenCenterId: gardenCenterId,
                    startPeriod: startPeriodDate,
                    endPeriod: endPeridDate
                };
                schedule.client = {clientId: client.clientData.id, name:  client.clientData.name};
                schedule.garden = {gardenId: garden.id, gardenAddress: garden.gardenAddress};
                // get schedule date
                schedule.date = tools.addDays(startPeriodDate,garden.service.dayOfWeek-1 );
                //add service tasks
                schedule.tasks = [];
                garden.service.tasks.forEach(function (task) {
                    schedule.tasks.push({
                        taskId: task.taskId,
                        topic: task.taskDescription,
                        description: task.taskDescription,
                        taskType: CTE.TASK_TYPE_SCHEDULED,
                        taskStatus:CTE.TASK_READY
                    });
                })
                //add special task
                if(garden.tasks!=null) {
                    garden.tasks.res.forEach(function(task) {
                        schedule.tasks.push({
                            taskId: task.id,
                            topic: task.topic,
                            description: task.description,
                            taskType: CTE.TASK_TYPE_SPECIAL,
                            taskStatus:CTE.TASK_READY,
                            conversation:task.conversation
                        });
                    })
                }
                schedule.visits=[];
                result.push(schedule);
            }
        })
    })
    return result;
}


function saveScheduleEntry(scheduleEntry) {
    var deferred = Q.defer();
    scheduleRepository.addScheduledService(scheduleEntry,function(err,value) {
        if(err)
            deferred.reject(err)
        deferred.resolve(value);
    })
    return deferred.promise;
}

function backupOldSchedule(gardenCenterId) {
    var deferred = Q.defer();
    scheduleRepository.getSchedule(gardenCenterId)
        .then(function(docs) {
            var promises=[]
            docs.forEach(function (schedule) {
            })
        }).fail(function(err) {
            deferred.reject(err);
    })
    return deferred.promise;

}

var scheduleService= function() {

   var _updateScheduleVisits=function(scheduleId,visits) {
       return scheduleRepository.updateScheduleVisits(scheduleId,visits)
   }

    var buidNewSchedule=function(gardenCenterId,startPeriodDate,endPeriodDate)
    {
        var deferred = Q.defer();
        scheduleRepository.backupSchedule(gardenCenterId)
            .then(function(ok) {
                return getGardenInformation(gardenCenterId)
            }).then(function(clientGardens) {
                    var scheduleEntries = createScheduleEntries(gardenCenterId, startPeriodDate, endPeriodDate, clientGardens);
                    var promises = [];
                    scheduleEntries.forEach(function (scheduleEntry) {
                        promises.push(saveScheduleEntry(scheduleEntry))
                    })
                    return Q.all(promises);
            }).then(function (value) {
                    deferred.resolve(value);
            }).fail(function(err){
                deferred.reject(err);
            })
        return deferred.promise;
    }

    var _getSchedule=function(gardenCenterId) {
        return scheduleRepository.getSchedule(gardenCenterId);
    }

    var getScheduleByGardenId=function(gardenCenterId,gardenId) {
        return scheduleRepository.getScheduleByGardenId(gardenCenterId,gardenId);
    }

  return {
      buidNewSchedule:buidNewSchedule,
      getSchedule:_getSchedule,
      getScheduleByGardenId:getScheduleByGardenId,
      updateScheduleVisits:_updateScheduleVisits
  }
}();

module.exports=scheduleService

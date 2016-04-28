/**
 * Created by xavierbarrufet on 19/4/16.
 */

var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var interventionRepository = require("../3-repository/interventionRepository");



function getError(results) {
    var res="";
    if(results[0].err!=null)
        return results[0].err;
    else
        return results[1].err;    
}

function buildAndSaveIntervention(interventionType,visit,tasks) {
    
    var deferred = Q.defer();
    var res={};   
    if(tasks.length>0) {
        res.gardenId=visit.gardenId;
        res.startDate=visit.startDate;
        res.endDate=visit.endDate;
        res.conversationId=visit.conversationId;
        res.interventionType=interventionType;
        res.tasks=tasks;
        interventionRepository.addIntervention(res,function(err,vIntervention) {
            if(err) {
                deferred.reject(err)
            }
            deferred.resolve(vIntervention)            
        })
    } else {
        deferred.resolve(null)
    }
    return deferred.promise
    
}


function splitTasks(visit) {
     var tasks={regular:[],special:[]};          
     var pos=0;
     for(task in visit.tasks) {
         if(task.taskType==CTE.TASK_SPECIAL_CODE)  {
             if(task.status==CTE.TASK_DONE)
                tasks.special.push(task);
        } else {
             if(task.status==CTE.TASK_DONE)
                tasks.regular.push(task);
        }              
    }    
    return tasks;
}


var interventionService = function() {
    var _getInterventions = function(gardenId) {
        var deferred = Q.defer();
        logger.debug("start gardenIn="+ gardenId,"interventionService","_getInterventions");
        interventionRepository.getInterventions(gardenId, function(err,vIntervention) {
            if(err) {
                logger.error(err,"interventionService","_getInterventions");
                deferred.resolve({error:err,res:null});
            }
            deferred.resolve({error:null,res:vIntervention});
        })
        return deferred.promise;
};
    
var _createInterventionsFromVisit = function(visit) {
        var deferred = Q.defer();        
        logger.debug("start","interventionService","_createInterventionsFromVisit");
        //split tasks in regular and mixed
        var tasks = splitTasks(visit)        
        Q.all(buildAndSaveIntervention(CTE.INTERVENTION_REGULAR,visits,tasks.regular),
              buildAndSaveIntervention(CTE.INTERVENTION_SPECIAL,visits,tasks.special))
        .then(function(results) {
            if(results[0].error!=null||results[1].error!=null) {
              if(results[0].res!=null)
                  interventionRepository.deleteIntervention(results[0].res.id,function() {
                    deferred.reject(getError(results));
                  });
              if(results[1].res!=null)
                  interventionRepository.deleteIntervention(results[1].res.id,function() {
                    deferred.reject(getError(results));
                    })        
            }
        })
        return deferred.promise;
};
    
var _addIntervention = funtion(intervention) {
       var deferred = Q.defer();                
        logger.debug("start","interventionService","_addIntervention");
        interventionRepository.addIntervention(intervention,function(err,vIntervention) {
            if (err) {
                logger.error(err, "interventionService", "_addIntervention");
                deferred.reject(err);
            }
            deferred.resolve(vIntervention)
        });
       return deferred.promise;
};
    
return {
    getInterventions:_getInterventions,
    createInterventionsFromVisit:_createInterventionsFromVisit,
    addIntervention:_addIntervention
}
    
}()

module.exports=interventionService
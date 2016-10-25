/**
 * Created by xavierbarrufet on 5/5/16.
 */
var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');

//var specialTaskService = require("../2-service/specialTaskService");
var specialTaskRepository = require("../3-repository/specialTaskRepository");
var conversationService = require("../2-service/conversationService");
var clientGardenService = require("../2-service/clientGardenService");
var DMS = require("../2-service/documentManagementService");


 function _createSpecialTask(clientId,gardenId,topic,description) {
    var deferred = Q.defer();
    logger.debug("start", "specialTaskService", "_addSpecialTask");
    var task = {clientId: clientId, gardenId: gardenId, topic: topic, description: description}
    return specialTaskRepository.addSpecialTask(task);
}



function _setConversationIdSpecialTask(taskId,conversationId) {
    var deferred = Q.defer();
    logger.debug("start","specialTaskService","_updateSpecialTaskConvesationId");
    specialTaskRepository.getSpecialTask(taskId)
        .then(function(vTask) {
            vTask.conversation = conversationId;
            return specialTaskRepository.updateSpecialTask(vTask)
        }).then(function(vtaskUpdated) {
                deferred.resolve(vtaskUpdated)
        }).fail(function(err) {
            deferred.reject(err);
        })
    return deferred.promise;
}

 function _setStatusSpecialTask(taskId,newStatus) {
    var deferred = Q.defer();
    logger.debug("start","specialTaskService","_updateStatusSpecialTask");
    specialTaskRepository.getSpecialTask(taskId)
        .then(function(vTask){
            vTask.status = newStatus
            return specialTaskRepository.updateSpecialTask(vTask)
        }).then(function(vtaskUpdated) {
            deferred.resolve(vtaskUpdated)
        }).fail(function(err) {
            deferred.reject(err);
        })
    return deferred.promise;
}

function _deleteSpecialTask(specialTaskId) {
    var deferred = Q.defer();
    logger.debug("start","specialTaskService","_deleteSpecialTask");
    specialTaskRepository.deleteSpecialTask(specialTaskId,function(err,vtask) {
        if (err) {
            logger.error(err, "specialTaskService", "_deleteSpecialTask");
            deferred.reject(err);
        }
        deferred.resolve(vtask)
    });
    return deferred.promise;

}




var specialTaskFlowService=function() {

    var _addSpecialTask = function(gardenCenterId,gardenId,topic) {
        var deferred = Q.defer();
        var vTask1,conversation;
        clientGardenService.getClientByGardenId(gardenCenterId,gardenId)
            .then(function(client) {
                var task = {gardenCenterId:gardenCenterId,clientId: client._id, gardenId: gardenId,
                            topic: topic, description: ""};
                return specialTaskRepository.addSpecialTask(task);
            }).then(function(vTask1) {
                return  conversationService.createConversationFromSpecialTask(vTask1)
            })
            .then(function(conversation) {
                return  _setConversationIdSpecialTask(conversation.specialTask,conversation.id)
            }).then(function(vTask2) {
                deferred.resolve(vTask2);
            }).fail(function(err) {
                if(vTask1!=null)
                    _deleteSpecialTask(taskId);
                if(conversation!=null)
                    conversationService.deleteConversation(conversation.id);
                deferred.reject(err);
            })
        return deferred.promise;
    }

    var _getSpecialTaskByStatus = function(gardenId,status) {
        var deferred = Q.defer();
        logger.debug("start gardenIn=" + gardenId, "specialTaskRepository", "_getSpecialTaskReady");
        specialTaskRepository.getSpecialTaskByGardenAndStatus(gardenId, status, function (err, vTask) {
            if (err) {
                logger.error(err, "specialTaskService", "_getInterventions");
                deferred.reject(err);
            }
            deferred.resolve(vTask);
        })
        return deferred.promise;

        return deferred.promise;
    }



    var _getSpecialTask = function(gardenCenterId,gardenId,taskId) {

        var deferred = Q.defer();
        logger.debug("start taskId="+ taskId,"specialTaskRepository","_getSpecialTask");
        return specialTaskRepository.getSpecialTaskByIdAndGarden(gardenCenterId,gardenId,taskId)
    }
    var _getSpecialTaskPopulated = function(taskId) {
        var deferred = Q.defer();
        logger.debug("start taskId="+ taskId,"specialTaskRepository","_getSpecialTask");
        specialTaskRepository.getSpecialTaskPopulated(taskId, function(err,vTask) {
            if(err) {
                logger.error(err,"specialTaskService","_getSpecialTask");
                deferred.resolve(err);
            }
            deferred.resolve(vTask);
        })
        return deferred.promise;
    }


    var _getSpecialTaskByStatus = function(gardenId,status) {
        var deferred = Q.defer();
        logger.debug("start gardenIn=" + gardenId, "specialTaskRepository", "_getSpecialTaskReady");

        specialTaskRepository.getSpecialTaskByGardenAndStatus(gardenId, status, function (err, vTask) {
            if (err) {
                logger.error(err, "specialTaskService", "_getInterventions");
                deferred.resolve({error: err, res: null});
            }
            deferred.resolve({error: null, res: vTask});
        })
        return deferred.promise;

    }

    var _updateStatusSpecialTask = function(taskId,status) {
        var deferred = Q.defer();
        specialTaskRepository.getSpecialTask(taskId)
            .then(function(task) {
                task.taskStatus = status;
                specialTaskRepository.updateSpecialTask(task)
            }).then(function(task) {
                    deferred.resolve(task)

            }).fail(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }


    var _getConversation = function(conversationId) {
        return conversationService.getConversation(conversationId)
    }
    var _getConversationsByGarden = function(gardenId) {
        return conversationService.getConversationsByGarden(gardenId)
    }
    var _addTextComment = function(gardenCenterid,conversationId,userId,text) {
        var comment={userId:userId,text:text,commentType:CTE.COMMENT_TYPE_TEXT}
        return conversationService.addComment(gardenCenterid,conversationId,comment);

    }
    var _addMediaCommentFromPath = function(gardenCenterid,conversationId,userId,text,filePath,mimeType) {
        var deferred = Q.defer();
        logger.debug("start conversationId="+ conversationId, "conversationService","_addMediaCommentFromPath");
        // /store file in DMS
        var cId = conversationId;
        DMS.putFileFromPath(filePath)
            .then(function(doc) {
                var files=[{fileId:doc.id,mimeType:mimeType}];
                var newComment = {userId:userId,text:text,commentType:CTE.COMMENT_TYPE_MEDIA,files:files};
                return conversationService.addComment(gardenCenterid,cId,newComment);
            }).then(function (comment) {
            deferred.resolve(comment);
        }).fail(function(err) {
            deferred.reject(err)
        })
        return deferred.promise;
    }
    var _addApprovalComment = function(gardenCenterid,conversationId,userId,text) {
        var deferred = Q.defer();
        var comment={userId:userId,text:text,commentType:CTE.COMMENT_TYPE_APPROVAL}
        conversationService.addComment(gardenCenterid,conversationId,comment)
            .then(function(vConversation) {
                // update status specialTask
                return _setStatusSpecialTask(vConversation.specialTask,CTE.TASK_READY);
            }).then(function(vTask) {
                    //Set flag approval
                    return conversationService.setPendingApprovalFlag(vTask.conversation, false);
            }).then(function(vConversation2) {
                    deferred.resolve(vConversation2)
            }).fail(function(err) {
                 deferred.reject(err);
        })
        return deferred.promise;
    }

    var _addRejectionComment = function(gardenCenterid,conversationId,userId,text) {
        var deferred = Q.defer();
        var comment={userId:userId,text:text,commentType:CTE.COMMENT_TYPE_REJECTION};
        conversationService.addComment(gardenCenterid,conversationId,comment)
            .then(function(conversation) {
                //Set flag approval
                return conversationService.setPendingApprovalFlag(conversationId, false)
            }).then(function(conversation) {
                deferred.resolve(conversation)
            }).fail(function(err) {
                deferred.reject(err);
            })
        return deferred.promise;
    }
    var _addAskForApprovalComment = function(gardenCenterid,conversationId,userId,text) {
        var deferred = Q.defer();
        var comment={userId:userId,text:text,commentType:CTE.COMMENT_TYPE_ASK_FOR_APPROVAL};
        conversationService.addComment(gardenCenterid,conversationId,comment)
        .then(function(conversation) {
            //Set flag approval
            return conversationService.setPendingApprovalFlag(conversationId, true)
        }).then(function(conversation) {
            deferred.resolve(conversation)
        }).fail(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }


return {

    getSpecialTaskByStatus:_getSpecialTaskByStatus,
    addSpecialTask:_addSpecialTask,
    getSpecialTask:_getSpecialTask,
    updateStatusSpecialTask:_updateStatusSpecialTask,
    getSpecialTaskByStatus:_getSpecialTaskByStatus,
    getSpecialTaskPopulated:_getSpecialTaskPopulated,


    getConversation: _getConversation,
    getConversationsByGarden: _getConversationsByGarden,
    addTextComment: _addTextComment,
    addMediaCommentFromPath: _addMediaCommentFromPath,
    addApprovalComment: _addApprovalComment,
    addRejectionComment: _addRejectionComment,
    addAskForApprovalComment: _addAskForApprovalComment

}

}()

module.exports=specialTaskFlowService
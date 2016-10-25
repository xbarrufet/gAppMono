/**
 * Created by xavierbarrufet on 1/5/16.
 */

var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var conversationRepository = require("../3-repository/specialTaskRepository");
var DMS =require("../2-service/documentManagementService")




var conversationService = function() {


    var _createConversation = function(clientId,gardenId,topic) {
        var deferred = Q.defer();
        logger.debug("start topic="+ conversation.topic, "conversationService","createConversation");
        var conversation={clientId:clientId,gardenId:gardenId,topic:topic,specialTaskId:specialTaskId};
        conversationRepository.createConversation(conversation, function(err,vConversation) {
            if(err) {
                logger.error(err,"conversationRepository","_createConversation");
                deferred.reject(err);
            }
            deferred.resolve(vConversation);
        })
        return deferred.promise;
    }

    var _createConversationFromSpecialTask = function(specialTask) {
        var deferred = Q.defer();
        logger.debug("start topic="+ specialTask.topic, "conversationService","createConversation");
        var conversation={clientId:specialTask.clientId,gardenCenterId:specialTask.gardenCenterId,
                          topic:specialTask.topic,specialTask:specialTask.id};
        conversationRepository.createConversation(conversation, function(err,vConversation) {
            if(err) {
                logger.error(err,"conversationRepository","_createConversation");
                deferred.reject(err);
            }
            deferred.resolve(vConversation);
        })
        return deferred.promise;
    }

    var _getConversation = function(conversationId) {
        logger.debug("start conversationId="+ conversationId, "conversationService","_getConversation");
        return conversationRepository.getConversation(conversationId)
    }

    var _getConversationsByGarden = function(gardenId) {
        logger.debug("start conversationId="+ conversationId, "conversationService","getConversationsByClientAndGarden");
        return conversationRepository.getConversationsByClientAndGarden(clientId, gardenId)

    }


    var _addComment = function (gardenCenterid,conversationId,comment) {
        var deferred = Q.defer();
        logger.debug("start topic="+ comment.topic, "conversationService","saveComment");
        conversationRepository.checkConversation(gardenCenterid,conversationId)
            .then(function(ok) {
                comment.timeStamp = Date();
                return conversationRepository.addComment(conversationId, comment)
            }).then(function(vComment) {
                    deferred.resolve(vComment);
            }).fail(function(err){
                deferred.reject(err);
        })
        return deferred.promise;
    }

   var _setPendingApprovalFlag=function(conversationId,approvalFlag) {
       return conversationRepository.setPendingApprovalFlag(conversationId,approvalFlag);
   }

    var _deleteConversation = function(conversationId) {
        return conversationRepository.deleteConversation(conversationId)
    }



    return {
        createConversation: _createConversation,
        createConversationFromSpecialTask:_createConversationFromSpecialTask,
        getConversation: _getConversation,
        getConversationsByGarden: _getConversationsByGarden,
        addComment: _addComment,
        setPendingApprovalFlag:_setPendingApprovalFlag,
        deleteConversation:_deleteConversation
    }

}();

module.exports=conversationService
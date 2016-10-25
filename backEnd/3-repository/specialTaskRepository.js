var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants')

var Q = require('Q');

var specialTaskRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;


    //es guarda una intervencio per visita i tipus de servei
    // servei regular:
    // servei especial

    var _conversationSchema = new Schema({
        topic: {type: String, required: true},
        gardenCenterId:{ type : Schema.Types.ObjectId , required : true},
        pendingApproval: {type:Boolean,default:false},
        specialTask:{ type : Schema.Types.ObjectId , required : false,ref: 'SpecialTask'},
        comments: [{
            userId: {type: Schema.Types.ObjectId, required: true},
            text: String,
            commentType: {type: String, required: true},
            files: [{fileId:String,mimeType:String}],
            timeStamp: {type: Date, required: true}
        }]
    });


    var _specialTaskSchema = new Schema({
        clientId:{ type : Schema.Types.ObjectId , required : true},
        gardenId:{ type : Schema.Types.ObjectId , required : true},
        gardenCenterId:{ type : Schema.Types.ObjectId , required : true},
        topic: { type : String ,  required : true},
        description: { type : String ,  required : false},
        status: { type : String ,  required : true,default:CTE.TASK_CREATED},
        conversation:{ type : Schema.Types.ObjectId , required : false,ref: 'Conversation'}
    });

    var _modelConversation = mongoose.model('Conversation', _conversationSchema);
    var _model = mongoose.model('SpecialTask', _specialTaskSchema);

    var _getSpecialTaskByGardenAndStatus = function(gardenId,status,callback) {
        logger.info("start","specialTaskRepository","_getSpecialTaskByGarden");
        _model.find({gardenId:gardenId,status:status}).populate('conversation').exec(function(err,docs) {
            if(err) {
                logger.error(err,"specialTaskRepository","_getSpecialTaskByGardenAndStatus");
                callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

    var _getSpecialTaskPopulated = function(taskId,callback) {
        logger.info("start","specialTaskRepository","_getSpecialTask");
        _model.findById(taskId).populate('conversation').exec(function(err,docs) {
            if(err) {
                logger.error(err,"specialTaskRepository","_getSpecialTask");
                callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

    var _getSpecialTask = function(taskId,callback) {
        logger.info("start","specialTaskRepository","_getSpecialTask");
        return _model.findById(taskId).exec();
    };

    var _getSpecialTaskByIdAndGarden= function(gardenCenterId,gardenId,taskId,callback) {
        logger.info("start","specialTaskRepository","_getSpecialTask");
        return _model.findOne({_id:taskId,gardenId:gardenId,gardenCenterId:gardenCenterId}).exec();
    };



    var _addSpecialTask = function(task) {
        var deferred = Q.defer();
        logger.info("start","specialTaskRepository","_addSpecialTask");
        _model.create(task, function (err, vTask) {
                if (err) {
                    logger.error(err, "specialTaskRepository", "_addSpecialTask");
                    deferred.reject(err);
                }
            deferred.resolve(vTask);
            });
        return deferred.promise;
    };




    var _updateSpecialTask= function(task) {
        logger.info("start","specialTaskRepository","_addSpecialTask");
        return _model.findByIdAndUpdate(task.id,task,{new: true}).exec();
    };


    var _deleteSpecialTask = function(taskId) {
        var deferred = Q.defer();
        logger.info("start taskId=" + taskId,"specialTaskRepository","_deleteTask");
        _model.findOneAndRemove({id:taskId},function(err,doc) {
            if(err) {
                logger.error(err,"specialTaskRepository","_deleteSpecialTask");
                deferred.reject(err)
            }
            deferred.resolve(taskId)
        })
        return deferred.promise;
    }

    //Conversations **************

    var _createConversation = function(newConversation,callback) {
        logger.info("start","conversationRepository","_createConversation");
        var conversation ={
            specialTask: newConversation.specialTask,
            topic:newConversation.topic,
            gardenCenterId:newConversation.gardenCenterId,
            description:newConversation.description
        };

        _modelConversation.create(conversation,
            function (err, vConversation) {
                if(err) {
                    logger.error(err,"conversationRepository","_createConversation");
                    callback(err, null);
                    return;
                }
                callback(null,vConversation);
                return;
            });
        return;
    }


    var _checkConversation=function(gardenCenterId,conversationId) {
        var deferred=Q.defer();

            _modelConversation.count({_id: conversationId, gardenCenterId: gardenCenterId},
                function (err, num) {
                    if (err)
                        deferred.reject(err)
                    deferred.resolve(num > 0);
                })

        return deferred.promise;
    }

    var _getConversation = function(conversationId,callback) {
        logger.info("start","conversationRepository","_getConversation");
        return _modelConversation.findById(conversationId).exec();
    };

    var _getConversationsByGarden = function(gardenId,callback) {
        logger.info("start","conversationRepository","_getConversationsByClientAndGarden");
        return _modelConversation.find({gardenId:gardenId}).exec();
    };

    var _addComment = function(conversationId,comment) {
        var deferred=Q.defer();
        logger.info("start conversationId=" + conversationId, "conversationRepository", "_addComment");
        comment.timeStamp=Date();
        _modelConversation.findById(conversationId, function (err, conversation) {
            if (err) {
                logger.error(err, "conversationRepository", "_addComment");
                deferred.reject(err);
            }
            conversation.comments.push(comment)
            conversation.save(function (err,vConversation) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(vConversation)
            })
        })
        return deferred.promise;
    }

    _setPendingApprovalFlag=function (conversationId,approvalFlag,callback) {

        logger.info("start conversationId=" + conversationId,"conversationRepository","_setPendingApprovalFlag");
        return _modelConversation.findByIdAndUpdate(conversationId,{pendingApproval:approvalFlag}, {new: true}).exec();
    }

    var _deleteConversation = function(conversationId) {
        var deferred=Q.promise();
        logger.info("start conversationId=" + conversationId,"conversationRepository","_deleteConversation");
        _modelConversation.findOneAndRemove({id:conversationId},function(err,vConversation) {
            if(err) {
                logger.error(err,"conversationRepository","_deleteConversation");
                deferred.reject(err)
            }
            deferred.resolve(conversationId)
        })
        return deferred.promise;
    }

    return {
        getSpecialTaskByGardenAndStatus: _getSpecialTaskByGardenAndStatus,
        getSpecialTask:_getSpecialTask,
        getSpecialTaskByIdAndGarden:_getSpecialTaskByIdAndGarden,
        getSpecialTaskPopulated:_getSpecialTaskPopulated,
        addSpecialTask:_addSpecialTask,
        updateSpecialTask:_updateSpecialTask,
        deleteSpecialTask:_deleteSpecialTask,

        createConversation: _createConversation,
        checkConversation:_checkConversation,
        getConversation: _getConversation,
        getConversationsByGarden: _getConversationsByGarden,
        addComment: _addComment,
        deleteConversation:_deleteConversation,
        setPendingApprovalFlag:_setPendingApprovalFlag,

        schema: _specialTaskSchema,
        model: _model,
        modelConversation: _modelConversation
    }
}();

module.exports = specialTaskRepository;

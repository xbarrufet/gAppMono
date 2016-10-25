/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var specialTaskFlowService = require("../../2-service/specialTaskFlowService");
var specialTaskRepository = require("../../3-repository/specialTaskRepository");

var database = require('../../5-Infrastructure/database')

/*

before(function(done) {
    //delete collection
    database.connect()
        .then(function() {
            specialTaskRepository.model.collection.drop(function(err) {
                specialTaskRepository.modelConversation.collection.drop(function(err) {
                    done()
                })
            })
        })
        .fail(function(err) {
            console.error(err.stack)
        })
});





describe("specialTask Service", function() {


    it("addSpecialTask ", function () {
        return specialTaskFlowService.addSpecialTask(sampleData.clientGarden11, sampleData.garden111,
            sampleData.specialTask111_1.topic, sampleData.specialTask111_1.description)
            .then(function (vTask) {
                should.exist(vTask.id);
                should.exist(vTask.conversation);
                sampleData.specialTask111_1 = vTask;
                return specialTaskFlowService.addSpecialTask(sampleData.clientGarden11, sampleData.garden111,
                    sampleData.specialTask111_2.topic, sampleData.specialTask111_2.description)
            }).then(function (vTask) {
                should.exist(vTask.id);
                should.exist(vTask.conversation);
                sampleData.specialTask111_2 = vTask;
                return specialTaskFlowService.addSpecialTask(sampleData.clientGarden12, sampleData.garden121,
                    sampleData.specialTask121_1.topic, sampleData.specialTask121_1.description)
            }).then(function (vTask) {
                should.exist(vTask.id);
                should.exist(vTask.conversation);
                sampleData.specialTask121_1 = vTask;
            }).fail(function (err) {
                throw new Error(err);
            })

    });

    it("add Comment ", function () {
        return specialTaskFlowService.addTextComment(sampleData.specialTask111_1.conversation,
            "Esto cuanto va a subir?", sampleData.user2.fakeId)
            .then(function (vConversation) {
                (vConversation.comments.length).should.equal(1);
                return specialTaskFlowService.addAskForApprovalComment(sampleData.specialTask111_1.conversation,
                    "unos 500", sampleData.user1.fakeId);
            }).then(function (vConversation) {
                (vConversation.comments.length).should.equal(2);
                (vConversation.pendingApproval).should.equal(true);
                return specialTaskFlowService.addApprovalComment(sampleData.specialTask111_1.conversation,
                    "", sampleData.user2.fakeId);
            }).then(function (vConversation) {
                (vConversation.comments.length).should.equal(3);
                (vConversation.pendingApproval).should.equal(false);
                return specialTaskFlowService.getSpecialTaskPopulated(vConversation.specialTask)
            }).then(function (vTask) {
                (vTask.status).should.equal(CTE.TASK_READY);
                sampleData.specialTask111_1=vTask;
                (vTask.conversation.comments.length).should.equal(3)
            }).fail(function (err) {
                throw new Error(err);
            })
    });

    it("add Media comment ", function () {
        return specialTaskFlowService.addMediaCommentFromPath(sampleData.specialTask121_1.conversation,
            "desde hace dos dias que no funciona", sampleData.IMG_Riego,'image/jpeg',sampleData.user2.fakeId)
            .then(function (vConversation) {
                (vConversation.comments.length).should.equal(1);
                (vConversation.comments[0].commentType).should.equal(CTE.COMMENT_TYPE_MEDIA);
                (vConversation.comments[0].files.length).should.equal(1);
            }).fail(function (err) {
                throw new Error(err);
            })

    })


})


after(function() {

})*/
/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var specialTaskFlowService = require("../../2-service/specialTaskFlowService");
var specialTaskRepository = require("../../3-repository/specialTaskRepository");

var request=require("supertest");
var app = require('../../server');

before(function(done) {
    //delete collection
    specialTaskRepository.model.collection.drop(function(err) {
        specialTaskRepository.modelConversation.collection.drop(function(err) {
            done()
        })
    })
});


describe("specialTask Service", function() {
    it("addSpecialTask 1", function (done) {

        request(app)
            .post('/api/v1/garden/' + sampleData.clientGarden31.gardens[0]._id + '/specialTask')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.specialTask31)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.topic.should.be.equal(sampleData.specialTask31.topic);
                (res.body.gardenCenterId).should.equal(sampleData.gardenCenter3._id);
                sampleData.specialTask31 = res.body;
                done();
            })

    });

   it("addSpecialTask 2", function (done) {

        request(app)
            .post('/api/v1/garden/' + sampleData.clientGarden31.gardens[0]._id + '/specialTask')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.specialTask32)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.topic.should.be.equal(sampleData.specialTask32.topic);
                (res.body.gardenCenterId).should.equal(sampleData.gardenCenter3._id);
                sampleData.specialTask32 = res.body;
                done();
            })

    });
    it("add text Comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/' + sampleData.specialTask31.conversation + '/textComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user2.fakeId)
            .send({text:"Esto cuanto va a subir?"})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.comments.length.should.equal(1);
                done();
            })
    })
    it("add AskForApproval Comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/' + sampleData.specialTask31.conversation + '/askForApprovalComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .send({text:"Total 500 euros"})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.comments.length.should.equal(2);
                res.body.pendingApproval.should.equal(true);
                done();
            })
    })
    it("add reject Comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/' + sampleData.specialTask31.conversation + '/rejectComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user2.fakeId)
            .send({text:"Donde vas ?????"})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.comments.length.should.equal(3);
                res.body.pendingApproval.should.equal(false);
                done();
            })
    })
    it("add AskForApproval Comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/' + sampleData.specialTask31.conversation + '/askForApprovalComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .send({text:"400, menos no puedo"})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.comments.length.should.equal(4);
                res.body.pendingApproval.should.equal(true);
                done();
            })
    })
    it("add Approval Comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/' + sampleData.specialTask31.conversation + '/approvalComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user2.fakeId)
            .send({text:"OK"})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.comments.length.should.equal(5);
                res.body.pendingApproval.should.equal(false);
                done();
            })
    })

   it("Get Special Task READY", function (done) {
        request(app)
            .get('/api/v1/garden/' + sampleData.clientGarden31.gardens[0]._id + '/specialTask/'+sampleData.specialTask31._id)
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.status.should.equal(CTE.TASK_READY);
                done();
            })
    })

    it("add Media comment ", function (done) {
        request(app)
            .post('/api/v1/conversation/'+ sampleData.specialTask32.conversation+'/mediaComment')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .set('Content-Type', 'img/jpeg')
            .field('text', 'todos iguales a este')
            .attach(CTE.UPLOAD_FILE_FIELD_NAME, sampleData.IMG_Riego)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                done();
            })

    })
    
})

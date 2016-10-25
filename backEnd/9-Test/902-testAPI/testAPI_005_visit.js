/**
 * Created by xavierbarrufet on 7/5/16.
 */

var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var tools = require('../../8-tools/tools');
var visitService = require("../../2-service/visitService");
var visitRepository = require("../../3-repository/visitRepository");

var request=require("supertest");
var app = require('../../server');


before(function(done) {
    //delete collection
    visitRepository.model.collection.drop(function(err) {
        done()
    })
});

describe("visit Service", function() {

    var visit1,visit2

    it("start visit 1", function (done) {

        request(app)
            .post('/api/v1/garden/'+ sampleData.clientGarden31.gardens[0]._id+'/visit')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user2.fakeId)
            .send({startDate:new Date()})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.tasks.length.should.equal(6);
                visit1=res.body;
                done();
            })
    });
    it("start visit 2", function (done) {
        request(app)
            .post('/api/v1/garden/'+ sampleData.clientGarden32.gardens[0]._id+'/visit')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user2.fakeId)
            .send({startDate:new Date()})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.tasks.length.should.equal(4);
                visit2=res.body;
                done();
            })
    });
    it("complete task of garden 1",function(done) {
       request(app)
            .post('/api/v1/visit/'+ visit1._id+'/task/'+ visit1.tasks[0]._id+ '/complete')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                visit1=res.body;
                res.status.should.be.equal(200);
                (visit1.tasks[0].taskStatus).should.equal(CTE.TASK_DONE);
                done();
            })
    });
    it("Non Applicable task of garden 1",function(done) {
        request(app)
            .post('/api/v1/visit/'+ visit1._id+'/task/'+ visit1.tasks[1]._id+ '/notApplicable')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                visit1=res.body;
                res.status.should.be.equal(200);
                (visit1.tasks[1].taskStatus).should.equal(CTE.TASK_NA);
                done();
            })
    });
    function repeatCompleteTask(pos) {
        it("complete task " + pos + " of garden 2",function(done) {
            request(app)
                .post('/api/v1/visit/'+ visit2._id+'/task/'+ visit2.tasks[pos]._id+ '/complete')
                .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
                .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    visit2=res.body;
                    res.status.should.be.equal(200);
                    (visit2.tasks[pos].taskStatus).should.equal(CTE.TASK_DONE);
                    done();
                })
        })
    }
    for(t=0;t<4;t++)
        repeatCompleteTask(t);

    it("close visit 1",function() {
        request(app)
            .post('/api/v1/visit/'+ visit1._id+'/close')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                visit1=res.body;
                (visit1.status).should.equal(CTE.VISIT_STATUS_CLOSED);
                (visit1.tasks[2].taskStatus).should.equal(CTE.TASK_SKIP);
                done();
            })

    })
    it("close visit 2",function() {
        request(app)
            .post('/api/v1/visit/'+ visit2._id+'/close')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .set(CTE.HTTP_HEADER_USER, sampleData.user1.fakeId)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                visit2=res.body;
                (visit2.status).should.equal(CTE.VISIT_STATUS_CLOSED);
                (visit2.tasks[2].taskStatus).should.equal(CTE.TASK_DONE);
                done();
            })
    })



    /*  it("complete all task of garden 1",function() {
          return visitService.completeVisitTaskStatus(visit111.tasks[0].taskId)
              .then(function (vVisit) {
                  (vVisit.tasks[0].taskStatus = CTE.TASK_DONE);
                  return visitService.completeVisitTaskStatus(visit111.tasks[1].taskId)
              }).then(function (vVisit) {
                  (vVisit.tasks[1].taskStatus = CTE.TASK_DONE);
                  return visitService.notApplicableVisitTaskStatus(visit111.tasks[2].taskId)
              }).then(function (vVisit) {
                  (vVisit.tasks[2].taskStatus=CTE.TASK_NA);
              }).fail(function (err) {
                  console.log(err)
                  throw new Error(err);
              })
      })
      it("complete 1 task of garden 2",function() {
          return visitService.completeVisitTaskStatus(visit121.tasks[0].taskId)
              .then(function (vVisit) {
                  (vVisit.tasks[0].taskStatus = CTE.TASK_DONE);
              }).fail(function (err) {
                  console.log(err)
                  throw new Error(err);
              })
      })
      it("close visit 1",function() {
          return visitService.closeVisit(visit111.id)
              .then(function (vVisit) {
                  (vVisit.status).should.equal(CTE.VISIT_STATUS_CLOSED);
                  (vVisit.tasks[0].taskStatus = CTE.TASK_DONE);
              }).fail(function (err) {
                  console.log(err)
                  throw new Error(err);
              })
      })
      it("close visit 2",function() {
          return visitService.closeVisit(visit121.id)
              .then(function (vVisit) {
                  (vVisit.status).should.equal(CTE.VISIT_STATUS_CLOSED);
                  (vVisit.tasks[1].taskStatus = CTE.TASK_SKIP);
              }).fail(function (err) {
                  console.log(err)
                  throw new Error(err);
              })
      })*/


})


after(function() {

})


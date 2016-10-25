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

var database = require('../../5-Infrastructure/database')
/*

before(function(done) {
    //delete collection
    database.connect()
        .then(function () {
            scheduleRepository.model.collection.drop(function (err) {
                    visitRepository.model.collection.drop(function (err) {
                        done()
                    })
                })
                .fail(function (err) {
                    console.error(err.stack)
                })
        })
});

describe("visit Service", function() {

    var visit111,visit121,visit112;

    it("start visit", function () {
        return visitService.createVisitFromSchedule(sampleData.garden111, new Date().getTime(),sampleData.user1)
            .then(function (vVisit) {
                should.exist(vVisit);
                (vVisit.tasks.length).should.equal(3);
                (vVisit.tasks[2].taskType).should.equal(CTE.TASK_TYPE_SPECIAL);
                visit111 = vVisit;
                return visitService.createVisitFromSchedule(sampleData.garden121,Date(),sampleData.user2)
            }) .then(function (vVisit) {
                should.exist(vVisit);
                (vVisit.tasks.length).should.equal(2);
                visit121=vVisit;
                return visitService.createVisitFromSchedule(sampleData.garden112,Date(),sampleData.user1)
            }) .then(function (vVisit) {
                should.exist(vVisit);
                (vVisit.tasks.length).should.equal(3);
                visit112=vVisit;
            }).fail(function (err) {
                console.log(err)
                throw new Error(err);
            })
    });


    it("complete all task of garden 1",function() {
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
    })


})


after(function() {

})

*/
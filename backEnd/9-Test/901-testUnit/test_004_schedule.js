/**
 * Created by xavierbarrufet on 6/5/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var tools = require('../../8-tools/tools');
var scheduleService = require("../../2-service/scheduleService");
var scheduleRepository = require("../../3-repository/scheduleRepository");

var database = require('../../5-Infrastructure/database')

/*

before(function(done) {
    //delete collection
    database.connect()
        .then(function() {
            scheduleRepository.model.collection.drop(function(err) {
                done()
            })
        })
        .fail(function(err) {
            console.error(err.stack)
        })
});



describe("schedule Service", function() {


    it("create Schedule gardenCenter1", function () {
        return scheduleService.buidNewSchedule(sampleData.gardenCenter1.id,Date(),tools.addDays(Date(),7))
            .then(function (vSchedule) {
                should.exist(vSchedule);
                (vSchedule.length).should.equal(3);
                (vSchedule[0].tasks.length).should.equal(3);
                (vSchedule[0].tasks[2].taskType).should.equal(CTE.TASK_TYPE_SPECIAL);
                should.exist(vSchedule[0].tasks[2].conversation);
            }).fail(function (err) {
                throw new Error(err);
            })

    });
    it("create Schedule gardenCenter2", function () {
        return scheduleService.buidNewSchedule(sampleData.gardenCenter2.id,Date(),tools.addDays(Date(),7))
            .then(function (vSchedule) {
                should.exist(vSchedule);
                (vSchedule.length).should.equal(1);
                (vSchedule[0].tasks.length).should.equal(2);
            }).fail(function (err) {
                throw new Error(err);
            })

    });


})


after(function() {

})

    */
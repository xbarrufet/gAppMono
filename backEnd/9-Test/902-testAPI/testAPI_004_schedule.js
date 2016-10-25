/**
 * Created by xavierbarrufet on 6/5/16.
 */

var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var tools = require('../../8-tools/tools');

var scheduleRepository = require("../../3-repository/scheduleRepository");

var request=require("supertest");
var app = require('../../server');



before(function(done) {
    //delete collection
    scheduleRepository.model.collection.drop(function() {
            done()
    })
   
});


describe("schedule Service", function() {


    it("create Schedule gardenCenter3", function (done) {
        request(app)
            .post('/api/v1/schedule/' + sampleData.gardenCenter3._id)
            .send({schedule:{startDate:new Date(),endDate:tools.addDays(new Date(),7)}})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.length).should.equal(2);
                (res.body[0].tasks.length).should.equal(6);
                (res.body[0].tasks[5].taskType).should.equal(CTE.TASK_TYPE_SPECIAL);
                done();
            })


    });
    it("get Schedule gardenCenter3", function (done) {
        request(app)
            .get('/api/v1/schedule/' + sampleData.gardenCenter3._id)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.length).should.equal(2);
                done();
            })


    });


});


after(function() {

});
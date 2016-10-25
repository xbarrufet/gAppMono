/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");

var request=require("supertest");
var app = require('../../server');
var sampleData =require("./../sampleData");
var gardenCenterRepository = require("../../3-repository/gardenCenterRepository");



before(function(done) {
    //delete collection

    gardenCenterRepository.model.collection.drop(function(err) {
        done()
    })
});

describe("gardenCenter Service", function() {

    it("API add GardenCenter", function (done) {
        request(app)
            .post('/api/v1/gardenCenter')
            .send(sampleData.gardenCenter3)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.name).should.equal(sampleData.gardenCenter3.name)
                sampleData.gardenCenter3=res.body;
                done();
            })
    })
    it("getGardenCenterById not exist", function (done) {
        console.log(sampleData.gardenCenter3._id);
        request(app)
            .get("/api/v1/gardenCenter/aaaaaaaaaaaaaaaaeaaaaaaa")
            .expect(404, done);
    })
    it("getGardenCenterById", function (done) {
        request(app)
            .get("/api/v1/gardenCenter/" + sampleData.gardenCenter3._id)
            .expect(200, done);
    })
    it("get GardenCenters", function (done) {
        request(app)
            .get("/api/v1/gardenCenter")
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.length).should.equal(1)
                done();
            })
    })
    it("update GardenCenter", function (done) {
        var updatedEmail = "updated@mail.com";
        sampleData.gardenCenter3.admin = updatedEmail
        request(app)
            .put("/api/v1/gardenCenter/" + sampleData.gardenCenter3._id)
            .send(sampleData.gardenCenter3)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.admin).should.equal(updatedEmail)
                done();
            })
    })

});



after(function() {

})
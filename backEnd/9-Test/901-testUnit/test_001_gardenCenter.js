/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var request=require("supertest");
var sampleData =require("./../sampleData");

var database = require('../../5-Infrastructure/database')

var gardenCenterService = require("../../2-service/gardenCenterService");
var gardenCenterRepository = require("../../3-repository/gardenCenterRepository");





before(function(done) {
    //delete collection
    database.connect()
        .then(function() {
            gardenCenterRepository.model.collection.drop(function(err) {
                done()
            })
        })
        .fail(function(err) {
            console.error(err.stack)
        })
});


describe("gardenCenter Service", function() {
    it("addGardenCenter 1", function (done) {
        return gardenCenterService.addGardenCenter(sampleData.gardenCenter1)
            .then(function(gardenCenter) {
                should.exist(gardenCenter.id);
                sampleData.gardenCenter1=gardenCenter;
                done();
            })
            .fail(function(err) {
                throw new Error(err);
            })
    })
    it("addGardenCenter 2", function (done) {
        return gardenCenterService.addGardenCenter(sampleData.gardenCenter2)
            .then(function(gardenCenter) {
                should.exist(gardenCenter.id);
                sampleData.gardenCenter2=gardenCenter;
                done();
            })
            .fail(function(err) {
                throw new Error(err);
            })
    })
    it("getGardenCenterById", function (done) {
        return gardenCenterService.getGardenCenterById( sampleData.gardenCenter1.id)
            .then(function(gardenCenter) {
                ( gardenCenter.id).should.equal(sampleData.gardenCenter1.id)
                done();
            }).fail(function(err) {
                throw new Error(err);
            })
    })
    it("update GardenCenter", function (done) {
        var updatedEmail = "updated@mail.com";
        sampleData.gardenCenter1.admin = updatedEmail
        return gardenCenterService.updateGardenCenter(sampleData.gardenCenter1._id,sampleData.gardenCenter1)
            .then(function(gardenCenter) {
                ( gardenCenter.admin).should.equal(updatedEmail)
                done();
            }).fail(function(err) {
                throw new Error(err);
            })
    })
    it("get GardenCenters", function (done) {
        return gardenCenterService.getGardenCenters()
            .then(function(docs) {
                ( docs.length).should.equal(2)
                done();
            }).fail(function(err) {
                throw new Error(err);
            })
    })

    /*it("API add GardenCenter", function (done) {
        request(server)
            .post('/api/v1/gardenCenter')
            .send(sampleData.gardenCenter3)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.should.have.status(400);
                done();
            })
    });*/


/*
    it("addUser", function() {
        var result=userService.addUser(sampleData.newUser);
        return result.then(function (user) {
            userId3=user.id;
            should(user.email).equal(sampleData.newUser.email);

        })
    });

    it("updateGardenCenters", function() {
        var result =userService.updateGardenCenters(userId3, "11-22-33-44");
        return result.then(function (profile) {
            console.log("ok1");
            should(profile.gardenCenter[0]).equal("11-22-33-44");

        })
    });

    it("getUsers", function() {
        var result =userService.getUsers();
        return result.then(function (docs) {
            var size = docs.length;
            should(size).equal(3);
        })
    });



    it("validate", function() {
        var result = userService.validate(sampleData.user1.email,sampleData.user1.password);
        return result.then(function (user) {
            should(sampleData.user1.email).equal(user.email);
        })
    });
    */
});



after(function() {

})
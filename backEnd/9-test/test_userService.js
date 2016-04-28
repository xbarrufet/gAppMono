/**
 * Created by xavierbarrufet on 20/4/16.
 */
var should=require("should");

var userRepository = require("../3-repository/userRepository");
var profileRepository = require("../3-repository/profileRepository");
var userService = require("../2-service/userService");

var sampleData =require("./sampleData");

process.env.NODE_ENV = 'test';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test_gAppMono');

var userId1,userId2,userId3;
before(function() {
    //add some test data
    try {
        userRepository.model.create(sampleData.user1, function (err, doc) {
            if (err)
                throw new Error(err);
            userId1=doc.id;
            console.log("userID1=" + userId1);
            userRepository.model.create(sampleData.user2,function(err,doc) {
                if (err)
                    throw new Error(err);
                userId2=doc.id;
            })
        })
    }
    catch (Err) {
        userRepository.model.remove({email:sampleData.newUser.email}, function () {
            console.log('user collection removed')
        });
    }
});


describe("user service", function() {


    it("_getUserByEmail", function(done) {
        userRepository.getUserByEmail(sampleData.user1.email, function(err,user) {
            if (err) {
                should(true).to.be.false;
            } else {
                should(user.email).equal(sampleData.user1.email)
            }
            done();
        })
    });

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


});



after(function() {
    userRepository.model.remove({}, function () {
        console.log('user collection removed')
    });
   profileRepository.model.remove({}, function () {
        console.log('profile collection removed')
    })
});

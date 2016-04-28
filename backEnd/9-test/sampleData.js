/**
 * Created by xavierbarrufet on 16/4/16.
 */


var sampleData = function() {


    var user1 = {
        email: "xbarrufetm@gmail.com",
        password:"1234",
        name: "Xavier Barrufet",
        type: "GARDEN"
    }

    var user2 = {
        email: "daniel.psn@gmail.com",
        password:"4321",
        name: "Daniel Plasencia",
        type: "CLIENT"

    }

    var newUser = {
        email: "josep32Hxn@yahoo.com",
        password:"0000",
        name: "Josep Hoxan",
        type: "GARDEN",
        admin: false
    }



    return {
        user1: user1,
        user2: user2,
        newUser: newUser
    }

}();

module.exports = sampleData;


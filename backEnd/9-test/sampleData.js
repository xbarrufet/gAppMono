/**
 * Created by xavierbarrufet on 16/4/16.
 */


var sampleData = function() {


    var user1 = {
        email: "xbarrufetm@gmail.com",
        password:"1234",
        name: "Xavier Barrufet",
        type: "GARDEN",
        admin: true,
        audit: {
            dateCreated:new Date("2015/11/18 12:03:16"),
            dateUpdated:new Date("2015/11/18 12:03:16"),
        }
    }

    var user2 = {
        email: "daniel.psn@gmail.com",
        password:"4321",
        name: "Daniel Plasencia",
        type: "CLIENT",
        admin: false,
        audit: {
            dateCreated:new Date("2015/09/23 08:43:01"),
            dateUpdated:new Date("2015/12/22 23:32:55"),
        }
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


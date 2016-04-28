/**
 * Created by xavierbarrufet on 19/4/16.
 */

var logger = require('../2-service/logger');
var Q = require('Q');
var userRepository = require("../3-repository/userRepository");
var profileRepository = require("../3-repository/profileRepository");
var tools = require("../8-tools/tools");

var userService = function() {



    var _getUsers = function() {
        var deferred = Q.defer();
        logger.debug("start","userService","_getUsers");
        userRepository.getAllUsers(function(err,users) {
                if(err) {
                    logger.error(err,"userService","_getUsers");
                    deferred.reject(err);
                }
                deferred.resolve(users);
            })
        return deferred.promise;
    };

    var _getUser = function(userId) {
        var deferred = Q.defer();
        logger.debug("start","userService","_getUser");
        userRepository.getUserById(userId,function(err,user) {
            if (err) {
                logger.error(err, "userService", "_getUser");
                deferred.reject(err);
            }
            deferred.resolve(user);
        });
        return deferred.promise;
    };

    var _getUserByEmail = function(email) {
        var deferred = Q.defer();
        logger.debug("start email=" +email,"userService","_getUserByEmail");
        userRepository.getUserByEmail(email,function(err,user) {
            if (err) {
                logger.error(err, "userService", "_getUser");
                deferred.reject(err);
            }
            deferred.resolve(user);
        })
        return deferred.promise;
    };

    var _updateGardens=function(userId,gardens) {
        var deferred = Q.defer();
        logger.debug("start userId=" +userId,"userService","_updateGardens");
        profileRepository.updateAllGardens(userId, gardens, function (err, profile) {
            if (err) {
                logger.error(err, "userService", "_updateGardens");
                deferred.reject(err);
            }
            deferred.resolve(profile);
        })
        return deferred.promise;
    }

    var _updateGardenCenters=function(userId,gardenCenters) {
        var deferred = Q.defer();
        logger.debug("start userId=" +userId,"userService","_updateGardenCenters");
        profileRepository.updateAllGardenCenters(userId,gardenCenters,function(err,profile) {
            if (err) {
                logger.error(err, "userService", "_updateGardenCenters");
                deferred.reject(err);
            }
            deferred.resolve(profile);
        })
        return deferred.promise;
    }

    var _getProfile=function(userId) {
        var deferred = Q.defer();
        logger.debug("start userId=" +userId,"userService","_getProfile");
        profileRepository.getProfile(userId,function(err,profile) {
            if (err) {
                logger.error(err, "userService", "_getProfile");
                deferred.reject(err);
            }
            deferred.resolve(profile);
        })
        return deferred.promise;
    }



    var _addUser = function(user) {
        var deferred = Q.defer();
        logger.debug("start","userService","_addUser");
        logger.debug("tranform userDTO to user","userService","_addUser");

        var errV=validateUser(user)
        if(errV!=null)
            deferred.reject(errV);

        userRepository.addUser(user,function(err,vUser) {
            if (err) {
                logger.error(err, "userService", "_addUser");
                deferred.reject(err);
            }
            profileRepository.createProfile(vUser.id, function (err, profile) {
                if (err) {
                    logger.error(err, "userService", "_addUser");
                    deleteUser(vUser.id);
                    deferred.reject(err);
                }
                deferred.resolve(vUser);
            })
        })
        return deferred.promise;
    };

    var _validate = function(username,password) {
        var deferred = Q.defer();
        logger.debug("start username=" + username,"userService","_validate");
        userRepository.validate(username,password,function(err,profile) {
            if (err) {
                logger.error(err, "userService", "_getProfile");
                deferred.reject(err);
            }
            deferred.resolve(profile);
        })
        return deferred.promise;
    };

    return {
        getUsers: _getUsers,
        getUser: _getUser,
        getUserByEmail:_getUserByEmail,
        updateGardenCenters:_updateGardenCenters,
        updateGardens:_updateGardens,
        getProfile:_getProfile,
        addUser:_addUser,
        validate:_validate
    }
}();


function deleteUser(userId) {
    userRepository.deleteUser(userId,function(err,user) {
        if(err!=null) {
            throw err;
        }
    })
}




function mapUserDTO(user) {
    var res ={};
    if("id" in user) {
        res.id=user.id;
    }
    if("name" in user) {
        res.name=user.name;
    }
    if("email" in user) {
        res.email=user.email;
    }
    if("type" in user) {
        res.type=user.type;
    }
    if("type" in user) {
        res.typeuser.type;
    }
    return res;
}

function validateUser(user) {

    if(!("name" in user)) {
        return "name is not present."
    }
    if(!("email" in user)) {
        return "email is not present."
    }
    if(!(tools.emailValidation(user.email))) {
        return "email is not correct."
    }
    if(!("type" in user)) {
        return "user type is not present."
    }
    return null;

}

/*function mapDTOUser(userDTO) {
    var res ={};
    if("id" in user) {
        res.id=user.id;
    }
    if("name" in user) {
        res.name=user.name;
    }
    if("email" in user) {
        res.email=user.email;
    }
    if("type" in user) {
        res.type=user.type;
    }
    if("type" in user) {
        res.typeuser.type;
    }
    return res;
}

function profileDTO(profile) {
    var res ={};
    res.userId=profile.userId;
    res.garden=profile.garden;
    res.gardenCenter=user.gardenCenter;
    return res;
}*/

module.exports = userService;


var logger = require('../2-service/logger');
var Q = require('Q');

var profileRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;


    var _profileSchema = new Schema({
        userId: { type : String , unique : true, required : true, dropDups: true },
        gardenCenter:[String],
        garden:[String],
        audit: {
            dateCreated:Date,
            dateUpdated:Date
        }

    });

    var _model = mongoose.model('Profile', _profileSchema);

    var _getProfile=function(userId,callback) {
        logger.info("start userid="+ userId ,"profileRepository","_getProfile");
        _model.findOne({userId:userId},function(err,profile) {
            if (err) {
                logger.error(err, "userRepository", "_validate");
                callback(err, null);
                return;
            }
            if (!profile) {
                logger.error("Profile for " + userId + " not found.", "profileRepository", "_getProfile");
                callback("Profile for " + userId + " not found.", null);
                return;
            }
            callback(null,profile);

        })
        return;
    }

    var _updateAllGardens= function(userId,gardens,callback) {
        logger.info("start userid=" + userId, "profileRepository", "_updateAllGardens");
        _getProfile(userId, function (err, profile) {
            if (err) {
                logger.error(err, "profileRepository", "_updateAllGardens");
                callback(err, null);
                return;
            }
            profile.garden = gardens;
            profile.save(function (err) {
                if (err) {
                    logger.error(err, "profileRepository", "_updateAllGardens");
                    callback(err, null);
                    return;
                }
                callback(null, profile);
            })
        })
        return;
    }

    var _updateAllGardenCenters= function(userId,gardenCenters,callback) {
        logger.info("start userid=" + userId, "profileRepository", "_updateAllGardenCenters");
        _getProfile(userId, function (err, profile) {
            if (err) {
                logger.error(err, "profileRepository", "_updateAllGardenCenters");
                callback(err, null);
                return;
            }
            profile.gardenCenter = gardenCenters;
            profile.save(function (err) {
                if (err) {
                    logger.error(err, "profileRepository", "_updateAllGardenCenters");
                    callback(err, null);
                    return;
                }
                callback(null, profile);

            })
        })
        return;
    }

    var _addGarden= function(userId,garden) {
        logger.info("start userid=" + userId, "profileRepository", "_addGarden");
        _getProfile(userId, function (err, profile) {
            if (err) {
                logger.error(err, "profileRepository", "_addGarden");
                callback(err, null);
                return;
            }
            if (profile.garden.indexOf(garden) == -1) {
                profile.garden.push(garden);
                profile.save(function (err) {
                    if (err) {
                        logger.error(err, "profileRepository", "_addGarden");
                        callback(err, null);
                        return;
                    }
                    callback(null, profile);
                });
            } else {
                callback(null, profile);
            }
        });
        return;
    }

    var _addGardenCenter = function(userId,gardenCenter,callback) {
        logger.info("start userid=" + userId, "profileRepository", "_addGardenCenter");
        _getProfile(userId, function (err, profile) {
            if (err) {
                logger.error(err, "profileRepository", "_addGardenCenter");
                callback(err, null);
                return;
            }
            if (profile.gardenCenter.indexOf(gardenCenter) == -1) {
                profile.gardenCenter.push(gardenCenter);
                profile.save(function (err) {
                    if (err) {
                        logger.error(err, "profileRepository", "_addGardenCenter");
                        callback(err, null);
                        return;
                    }
                    callback(null, profile);
                });
            } else {
                callback(null, profile);
            }
        })
        return;
    };



    var _createProfile = function(userId,callback) {
        logger.info("start userid=" + userId, "profileRepository", "_createProfile");
        var profile =({
            userId: userId,
            audit:{
                dateCreated:new Date(),
                dateUpdatede:new Date()
            }
        });
        _model.create(profile, function (err, vProfile) {
                if (err) {
                    logger.error(err, "profileRepository", "_addGardenCenter");
                    callback(err, null);
                    return;
                }
                callback(null, vProfile);
            });
        return;
    }


    return {
        getProfile: _getProfile,
        updateAllGardens:_updateAllGardens,
        updateAllGardenCenters:_updateAllGardenCenters,
        createProfile:_createProfile,
        addGardenCenter:_addGardenCenter,
        addGarden:_addGarden,

        schema: _profileSchema,
        model: _model
    }
}();

module.exports = profileRepository;

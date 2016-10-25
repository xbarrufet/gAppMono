var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants')

var Q = require('Q');

var gardenCenterRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;
    mongoose.Promise = require('Q').Promise;


    //es guarda una intervencio per visita i tipus de servei
    // servei regular:
    // servei especial

    var _gardenCenterSchema = new Schema({
        name: {type: String, required: true},
        gardenCenterAddress: {
            address: {type: String, required: true},
            city: {type: String, required: true},
            province: {type: String, required: true},
            PO: {type: String, required: true}
        },
        phone: {type: String},
        admin: {type: String, required: true}
    });

    var _model = mongoose.model('GardenCenter', _gardenCenterSchema);


    var _getGardenCenterById = function (gardenCenterId, callback) {
        logger.info("start gardenCenterId=" + gardenCenterId, "gardenCenterRepository", "_getGardenCenterById");
        return _model.findById(gardenCenterId).exec();
    };

    var _getGardenCenters = function (callback) {
        logger.info("start", "gardenCenterRepository", "_getGardenCenters");
        return _model.find({}).exec()
    };


    var _addGardenCenter = function (newGardenCenter, callback) {

        logger.info("start", "gardenCenterRepository", "_addGardenCenter");
        var gardenAddress = {
            address: newGardenCenter.gardenCenterAddress.address,
            city: newGardenCenter.gardenCenterAddress.city,
            province: newGardenCenter.gardenCenterAddress.province,
            PO: newGardenCenter.gardenCenterAddress.PO
        }
        var gardenCenter = {
            name: newGardenCenter.name,
            gardenCenterAddress: gardenAddress,
            admin: newGardenCenter.admin,
            phone: newGardenCenter.phone
        };

        _model.create(gardenCenter,
            function (err, vGardenCenter) {
                if (err) {
                    logger.error(err, "gardenCenterRepository", "_addGardenCenter");
                    callback(err, null);
                }
                callback(null, vGardenCenter)
            });
        return;
    };


    var _updateGardenCenter = function (gardenCenterId, gardenCenter, callback) {
        logger.info("start", "gardenCenterRepository", "_updateGardenCenter");
        return _model.findByIdAndUpdate(gardenCenterId, gardenCenter, {new: true}).exec()
    };

    var _checkClientGardenCenterExist=function (gardenCenterId, clientId) {
        var deferred=Q.defer();
        _model.count({_id:clientId,gardenCenterId:gardenCenterId},function(err,count){
            if(err)
                deferred.reject(err)
            var res=(count>0);
            deferred.resolve(res)
        })
        return deferred.promise;
    }


    var _deleteGardenCenter = function(gardenCenterId) {
        logger.info("start gardenCenterId=" + gardenCenterId,"gardenCenterRepository","_deleteGardenCenter");
        return _model.findOneAndRemove({_id:gardenCenterId}).exec();
    }

    return {
        getGardenCenterById: _getGardenCenterById,
        getGardenCenters:_getGardenCenters,
        addGardenCenter:_addGardenCenter,
        updateGardenCenter:_updateGardenCenter,
        deleteGardenCenter:_deleteGardenCenter,
        schema: _gardenCenterSchema,
        model: _model
    }
}();

module.exports = gardenCenterRepository;

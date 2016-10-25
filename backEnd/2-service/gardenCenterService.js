/**
 * Created by xavierbarrufet on 19/4/16.
 */

var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var gardenCenterRepository = require("../3-repository/gardenCenterRepository");




var gardenCenterService = function() {
    var _getGardenCenters = function() {
        logger.debug("start","gardenCenterService","_getGardenCenters");
        return gardenCenterRepository.getGardenCenters()
    };

    var _getGardenCenterById= function(gardenCenterId) {
        logger.debug("start gardenCenterId="+ gardenCenterId,"gardenCenterService","_getGardenCenterById");
        return gardenCenterRepository.getGardenCenterById(gardenCenterId);
    };

    


    var _addGardenCenter = function(gardenCenter) {
        var deferred = Q.defer();
        logger.debug("start","gardenCenterService","_addGardenCenter");
        gardenCenterRepository.addGardenCenter(gardenCenter,function(err,vGardenCenter) {
            if (err) {
                logger.error(err, "gardenCenterService", "_addGardenCenter");
                deferred.reject(err);
            }
            deferred.resolve(vGardenCenter)
        });
        return deferred.promise;
    };

    var _updateGardenCenter = function(gardenCenterId,gardenCenter) {
        logger.debug("start gardenCenterId="+ gardenCenterId,"gardenCenterService","_updateGardenCenter");
        return gardenCenterRepository.updateGardenCenter(gardenCenterId,gardenCenter);
    };

    var _deleteGardenCenter = function(gardenCenterId) {
        logger.debug("start  gardenCenterId="+ gardenCenterId,"gardenCenterService","_deleteGardenCenter");
        return gardenCenterRepository.deleteGardenCenter(gardenCenterId);
    };


    return {
        getGardenCenters:_getGardenCenters,
        getGardenCenterById:_getGardenCenterById,
        addGardenCenter:_addGardenCenter,
        updateGardenCenter:_updateGardenCenter,
        deleteGardenCenter:_deleteGardenCenter
    }

}()

module.exports=gardenCenterService
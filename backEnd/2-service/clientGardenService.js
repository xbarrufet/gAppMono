/**
 * Created by xavierbarrufet on 3/5/16.
 */
var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants');
var Q = require('Q');
var clientGardenRepository = require("../3-repository/clientGardenRepository");



function checkAndGetGarden(gardenCenterId,clientId,gardenId) {
    var deferred = Q.defer();
    clientGardenRepository.getGardenById(gardenId)
        .then(function (client) {
            if (client==undefined||client._id != clientId || client.gardenCenterId != gardenCenterId)
                deferred.reject("Garden doesn't exist")
            if (client.gardens != undefined && client.gardens.length != 1)
                deferred.reject("Garden doesn't exist")
            deferred.resolve(client.gardens[0]);
    }).fail(function (err) {
        deferred.reject(err)
    })
    return deferred.promise;
}

var clientGardenService = function() {

    var _getClientById = function(gardenCenterId,clientId) {
        logger.debug("start clientId="+clientId,"clientGardenService","_getClientById");
        return clientGardenRepository.getClientById(gardenCenterId,clientId);

    }

    var _getClientsByGardenCenter= function(gardenCenterId) {
        logger.debug("start gardenCenterId="+ gardenCenterId,"clientGardenService","_getGardenCenterById");
        return clientGardenRepository.getClientsByGardenCenter(gardenCenterId);
    };


    var _addClient = function(gardenCenterId,client) {
        var deferred = Q.defer();
        logger.debug("start gardenCenterId="+gardenCenterId,"clientGardenService","_addClient");
        client.gardenCenterId=gardenCenterId;
        clientGardenRepository.addClient(client,function(err,vClient) {
            if (err) {
                logger.error(err, "clientGardenService", "_addClient");
                deferred.reject(err);
            }
            deferred.resolve(vClient)
        });
        return deferred.promise;
    };

    var _updateClient = function(gardenCenterId,client) {
        var deferred = Q.defer();
        logger.debug("start","clientGardenService","_updateClient");
        clientGardenRepository.checkClientGardenCenterExist(gardenCenterId,client._id)
            .then(function(ok) {
                return clientGardenRepository.updateClient(client);
            }).then(function(doc) {
                deferred.resolve(doc)
            }).fail(function (err) {
                deferred.reject(err)
        })
        return deferred.promise;
    };


    var _addGarden=function(gardenCenterId,clientId,gardenAddress,service) {
        var deferred = Q.defer();
        logger.debug("start","clientGardenService","_addGarden");
       // prepare data
        var garden={}
        if(service==null) {
            garden.serviceType=CTE.GARDEN_SERVICE_TYPE_OPEN;
        } else {
            garden.serviceType=CTE.GARDEN_SERVICE_TYPE_SCHEDULED;
            garden.service=service;
        }
        if(gardenAddress!=null) {
            garden.gardenAddress=gardenAddress;
        }
        clientGardenRepository.checkClientGardenCenterExist(gardenCenterId,clientId)
            .then(function(ok) {
                return clientGardenRepository.addGarden(clientId,garden);
            }).then(function(doc) {
                    deferred.resolve(doc)
            }).fail(function (err) {
                deferred.reject(err)
            })
        return deferred.promise;
    }

    var _updateGardenAddress=function(gardenCenterId,clientId,gardenId,gardenAddress) {
        var deferred = Q.defer();
        logger.debug("start", "clientGardenService", "_updateGardenAddress");
        // prepare data
        checkAndGetGarden(gardenCenterId,clientId,gardenId)
            .then(function(garden) {
                garden.gardenAddress = gardenAddress;
                return clientGardenRepository.updateGarden(clientId,garden);
            }).then(function(client) {
                deferred.resolve(client)
        }).fail(function (err){
            deferred.reject(err)
        })
        return deferred.promise;
    }

    var getClientByGardenId=function getGarden(gardenCenterId,gardenId) {
        var deferred = Q.defer();
        clientGardenRepository.getGardenById(gardenId)
            .then(function (client) {
                if (client==undefined|| client.gardenCenterId != gardenCenterId)
                    deferred.reject("Garden doesn't exist")
                if (client.gardens != undefined && client.gardens.length != 1)
                    deferred.reject("Garden doesn't exist")
                deferred.resolve(client);
            }).fail(function (err) {
            deferred.reject(err)
        })
        return deferred.promise;

    }

    var _updateGardenServices=function(gardenCenterId,clientId,gardenId,service) {
        var deferred = Q.defer();
        logger.debug("start", "clientGardenService", "_updateGardenAddress");
        // prepare data
        checkAndGetGarden(gardenCenterId,clientId,gardenId)
            .then(function(garden) {
                garden.service = service;
                if(service.tasks==undefined)
                    garden.serviceType=CTE.GARDEN_SERVICE_TYPE_OPEN;
                else
                    garden.serviceType=CTE.GARDEN_SERVICE_TYPE_SCHEDULED;
                return clientGardenRepository.updateGarden(clientId,garden);
            }).then(function(client) {
            deferred.resolve(client)
        }).fail(function (err){
            deferred.reject(err)
        })
        return deferred.promise;
    }


    return {

        getClientById:_getClientById,
        getClientsByGardenCenter:_getClientsByGardenCenter,
        addClient:_addClient,
        updateClient:_updateClient,
        addGarden:_addGarden,
        updateGardenAddress: _updateGardenAddress,
        updateGardenServices:_updateGardenServices,
        getClientByGardenId:getClientByGardenId
    }

}()

module.exports=clientGardenService


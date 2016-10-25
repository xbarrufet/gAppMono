var logger = require('../2-service/logger');
var CTE = require('../4-helpers/constants')


var Q = require('Q');

var clientGardenRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;

    var _gardenSchema = new Schema({gardenId: {type: String, required: true},
                            gardenAddress: {
                                address: {type: String, required: true},
                                city: {type: String, required: true},
                                province: {type: String, required: true},
                                PO: {type: String, required: true}
                            },
                            serviceType: {type: String, required: true, default: CTE.GARDEN_SERVICE_TYPE_SCHEDULED},
                            service: {
                                dayOfWeek: Number,
                                    tasks: [{
                                    taskId: String,
                                    taskDescription: String
                                }]
                            }});

    var _clientGardenSchema = new Schema({
        name:{ type : String , required : true},
        clientAddress: {
            address: { type : String ,  required : true},
            city:{ type : String ,  required : true},
            province:{ type : String ,  required : true},
            PO:{ type : String ,  required : true}
        },
        phone:{type:String},
        email: { type : String ,  required : true},
        gardenCenterId:{ type : String , required : true},
        gardens:[_gardenSchema]
    });

    var _model = mongoose.model('ClientGarden', _clientGardenSchema);


    var _addClient = function(newClient,callback) {
        var deferred = Q.defer();
        logger.info("start","clientGardenRepository","_addClient");
        var clientAddress = {
            address: newClient.clientAddress.address,
            city: newClient.clientAddress.city,
            province: newClient.clientAddress.province,
            PO: newClient.clientAddress.PO
        }

        var client =({
            name:newClient.name,
            clientAddress: clientAddress,
            gardenCenterId:newClient.gardenCenterId,
            email: newClient.email
        });

        _model.create(client,
            function (err, vClient) {
                if(err) {
                    logger.error(err,"clientGardenRepository","_addClient");
                    callback(err,null);
                    return;
                }
                callback(null,vClient)
            });
        return deferred.promise
    };


    var _checkClientGardenCenterExist=function (gardenCenterId, clientId) {
        var deferred=Q.defer();
        _model.count({_id:clientId,gardenCenterId:gardenCenterId},function(err,count){
            if(err)
                deferred.reject(err)
            if(count>0)
                deferred.resolve(true)
            else
                deferred.reject("Client doesn't exist");
        })
        return deferred.promise;
    }


    var _updateClient= function(updClient) {
        logger.info("start clientId="+updClient._id,"clientGardenRepository","_updateClient");
        return _model.findByIdAndUpdate(updClient._id, updClient, {new: true}).exec()
    };

    var _deleteClient = function(clientId) {
        var deferred = Q.defer();
        logger.info("start clientId=" + gardenCenterId,"clientGardenRepository","_deleteClient");
        _model.findOneAndRemove({id:gardenCenterId},function(err,vClient) {
            if(err) {
                logger.error(err,"clientGardenRepository","_deleteClient");
                deferred.reject(err)
            }
            deferred.resolve(vClient)
        })
        return deferred.promise;
    }

    var _getClientById = function(gardenCenterId,clientId) {
        logger.info("start","clientGardenRepository","_getClientById");
        return _model.find({_id:clientId,gardenCentedId:gardenCenterId}).exec();
    };



    var _getClientsByGardenCenter = function(gardenCenterId,callback) {
        return _model.find({gardenCenterId:gardenCenterId}).exec()
    }




    var _addGarden = function(clientId,garden,callback) {
        logger.info("start", "clientGardenRepository", "_addgarden");
        return _model.findByIdAndUpdate(clientId, {$push:{"gardens":garden}},{new: true}).exec()
    };

    var _getGardenById=function(gardenId) {
        logger.info("start", "clientGardenRepository", "_getGardenById");
        return _model.findOne({'gardens._id': mongoose.Types.ObjectId(gardenId)}, {'gardenCenterId':1,'gardens.$': 1}).exec()
    }


    var _updateGarden= function(clientId,garden) {
        logger.info("start","gardenRepository","_updateGarden");
        return _model.findOneAndUpdate({'gardens._id':mongoose.Types.ObjectId(garden._id)},
                {'$set':  {'gardens.$': garden}},{new: true}).exec()
    };


    var _deleteGarden = function(gardenId,callback) {
        logger.info("start","gardenRepository","_deleteGarden");
        model.findAndUpdate({'gardens.gardenId':garden.gardenId},
            {'$pull': {gardens: { gardenId: gardenId } }},
            function (err, vClient) {
                if(err) {
                    logger.error(err,"gardenRepository","_deleteGarden");
                    callback(err,null);
                    return;
                }
                callback(null,gardenId)
            });
        return;
    }

    return {
        addClient: _addClient,
        updateClient:_updateClient,
        deleteClient:_deleteClient,
        getClientsByGardenCenter:_getClientsByGardenCenter,
        getClientById:_getClientById,
        checkClientGardenCenterExist:_checkClientGardenCenterExist,
        addGarden: _addGarden,
        updateGarden:_updateGarden,
        deleteGarden:_deleteGarden,
        getGardenById:_getGardenById,
        schema: _clientGardenSchema,
        model: _model
    }
}();

module.exports = clientGardenRepository;

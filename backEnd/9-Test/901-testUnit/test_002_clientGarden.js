/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");

var CTE = require('../../4-helpers/constants');
var clientGardenService = require("../../2-service/clientGardenService");
var clientGardenRepository = require("../../3-repository/clientGardenRepository");

var database = require('../../5-Infrastructure/database')

before(function(done) {
    //delete collection
    database.connect()
        .then(function() {
            clientGardenRepository.model.collection.drop(function(err) {
                done()
            })
        })
        .fail(function(err) {
            console.error(err.stack)
        })
});



describe("clientGarden Service", function() {
    it("addClients ", function () {
        return clientGardenService.addClient(sampleData.gardenCenter1.id,
            sampleData.clientGarden11)
            .then(function (client) {
                should.exist(client.id);
                sampleData.clientGarden11 = client;
                return clientGardenService.addClient(sampleData.gardenCenter1.id,
                    sampleData.clientGarden12)
            }).then(function (client) {
                should.exist(client.id);
                sampleData.clientGarden12 = client;
                return clientGardenService.addClient(sampleData.gardenCenter2.id,
                    sampleData.clientGarden21)
            }).then(function (client) {
                should.exist(client.id);
                sampleData.clientGarden21 = client;
                return clientGardenService.addClient(sampleData.gardenCenter2.id,
                    sampleData.clientGarden22)
            }).then(function (client) {
                        should.exist(client.id);
                        sampleData.clientGarden22 = client;
            }).fail(function (err) {
                throw new Error(err);
            })
    })

    it("updateClients ", function () {
        var updatedEmail = "updated@mail.com";
        sampleData.clientGarden11.email = updatedEmail
        return clientGardenService.updateClient(sampleData.gardenCenter1.id,sampleData.clientGarden11)
            .then(function(client) {
                ( client.email).should.equal(updatedEmail)
            }).fail(function(err) {
                throw new Error(err);
            })
    })
    it("getClientById", function () {
        return clientGardenService.getClientById( sampleData.clientGarden11.id)
            .then(function(client) {
                ( client.id).should.equal(sampleData.clientGarden11.id)
            }).fail(function(err) {
                throw new Error(err);
            })
    })
    it("getClientsByGardenCenter", function () {
        return clientGardenService.getClientsByGardenCenter( sampleData.gardenCenter1.id)
            .then(function(docs) {
                ( docs.length).should.equal(2)
            }).fail(function(err) {
                throw new Error(err);
            })
    })
    it("addGardens", function () {
        return clientGardenService.addGarden(sampleData.clientGarden12.id,
            null,sampleData.garden121.service
            )
            .then(function (client) {
                should.exist(client.gardens);
                (client.gardens.length).should.equal(1);
                sampleData.garden121=client.gardens[0];
                should.exist(sampleData.garden121.id);
                (sampleData.garden121.serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_SCHEDULED);
                return clientGardenService.addGarden(sampleData.clientGarden21.id,
                    sampleData.garden211.gardenAddress,sampleData.garden211.service
                )
            }).then(function (client) {
                (client.gardens.length).should.equal(1);
                sampleData.garden211=client.gardens[0];
                should.exist(sampleData.garden211.id);
                (sampleData.garden211.serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_SCHEDULED);
            }).fail(function (err) {
                throw new Error(err);
            })
    })

    it("addGardens multiple", function () {
        return clientGardenService.addGarden(sampleData.clientGarden11.id,
                                             null,sampleData.garden111.service
                                             )
            .then(function (client) {
                (client.gardens.length).should.equal(1);
                sampleData.garden111=client.gardens[0];
                (sampleData.garden111.serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_SCHEDULED);
                return clientGardenService.addGarden(sampleData.clientGarden11.id,
                                                    sampleData.garden112.gardenAddress,sampleData.garden112.service
                                                    )
            }).then(function (client) {
                (client.gardens.length).should.equal(2);
                should.exist(client.gardens[1].gardenAddress.address);
                sampleData.garden112 = client.gardens[1];
                return clientGardenService.getClientById(sampleData.clientGarden11.id);
            }).then(function (client) {
                (client.gardens.length).should.equal(2);
                return clientGardenService.getClientsByGardenCenter(sampleData.gardenCenter1.id)
            }).then(function (clients) {
                (clients.length).should.equal(2);
                //should.exist(clients[0].gardens);
            }).fail(function (err) {
                throw new Error(err);
            })
    })
    it("addGardens open", function () {
        return clientGardenService.addGarden(sampleData.clientGarden22.id,
            null, null
            )
            .then(function (client) {
                (client.gardens.length).should.equal(1);
                sampleData.garden221 = client.gardens[0];
                (sampleData.garden221.serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_OPEN)

            }).fail(function (err) {
                throw new Error(err);
            })
    })

    it("update Garden", function () {
        var newAddress= {
                address: "C/ Updated ",
                city: "Updated",
                province: "Updated",
                PO: "00000"
        }
        return clientGardenService.updateGarden(sampleData.clientGarden12.id,sampleData.garden121.id,
            sampleData.garden121.service,newAddress
            )
            .then(function (client) {
                (client.gardens.length).should.equal(1);
                (sampleData.garden121.id).should.equal(client.gardens[0].id);
                (sampleData.garden121.serviceType).should.equal(client.gardens[0].serviceType);
                sampleData.garden121=client.gardens[0];
                should.exist(sampleData.garden121.gardenAddress);
                (sampleData.garden121.gardenAddress.city).should.equal("Updated")
                return clientGardenService.getClientById(sampleData.clientGarden12.id);
            }).then(function (client) {
                should.exist(client.gardens);
                (client.gardens.length).should.equal(1)
            }).fail(function (err) {
                throw new Error(err);
            })
    })



});


after(function() {

})
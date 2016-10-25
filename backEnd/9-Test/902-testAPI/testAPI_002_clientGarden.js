/**
 * Created by xavierbarrufet on 20/4/16.
 */
var mongoose = require('mongoose');
var should=require("should");
var sampleData =require("./../sampleData");
var CTE = require('../../4-helpers/constants');
var request=require("supertest");
var app = require('../../server');

var clientGardenRepository = require("../../3-repository/clientGardenRepository");



before(function(done) {
    //delete collection

    clientGardenRepository.model.collection.drop(function(err) {
        done()
    })
});


describe("clientGarden Service", function() {


    it("addClient 1 API", function(done){
        request(app)
            .post('/api/v1/clients')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.clientGarden31)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.name).should.equal(sampleData.clientGarden31.name)
                sampleData.clientGarden31=res.body;
                done();
            })
    })
    it("addClient 2 API", function(done){
        request(app)
            .post('/api/v1/clients')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.clientGarden32)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.name).should.equal(sampleData.clientGarden32.name)
                sampleData.clientGarden32=res.body;
                done();
            })
    })

    it("update Clients ", function (done) {
        var updatedEmail = "updated@mail.com";
        sampleData.clientGarden32.email = updatedEmail
        request(app)
            .put('/api/v1/clients/' + sampleData.clientGarden32._id)
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.clientGarden32)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.email).should.equal(updatedEmail)
                done();
            })
    })
    it("getClientById", function (done) {
        request(app)
            .get("/api/v1/clients/" + sampleData.clientGarden32._id)
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .expect(200, done);
    })

    it("getClients", function (done) {
        request(app)
            .get("/api/v1/clients")
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.length).should.equal(2)
                done();
            })
    })

    it("addGarden API", function (done) {
        var garden={services:sampleData.garden31.services};
        request(app)
            .post('/api/v1/clients/' + sampleData.clientGarden31._id + '/garden')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(garden)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.gardens.length).should.equal(1);
                sampleData.clientGarden31=res.body;
                done();
            })
    })
    it("addGarden API 2", function (done) {
        var garden={services:sampleData.garden32.services};
        request(app)
            .post('/api/v1/clients/' + sampleData.clientGarden32._id + '/garden')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(garden)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.gardens.length).should.equal(1);
                sampleData.clientGarden32=res.body;
                done();
            })
    })
    it("update Garden Address", function (done) {
        var newAddress= {
            address: "C/ Updated ",
            city: "Updated",
            province: "Updated",
            PO: "00000"
        }
        request(app)
                .put('/api/v1/clients/' + sampleData.clientGarden32._id +
                            '/garden/'+ sampleData.clientGarden32.gardens[0]._id + '/address')
                .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
                .send(newAddress)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    (res.body.gardens.length).should.equal(1);
                    should.exist(res.body.gardens[0].gardenAddress);
                    done();
                })
    })

    it("update Garden Services ", function (done) {
        request(app)
            .put('/api/v1/clients/' + sampleData.clientGarden32._id +
                '/garden/'+ sampleData.clientGarden32.gardens[0]._id + '/services')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send()
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.gardens.length).should.equal(1);
                (res.body.gardens[0].serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_OPEN);
                done();
            })
    })
    it("update Garden Services ", function (done) {
        request(app)
            .put('/api/v1/clients/' + sampleData.clientGarden32._id +
                '/garden/'+ sampleData.clientGarden32.gardens[0]._id + '/services')
            .set(CTE.HTTP_HEADER_GARDENCENTERID, sampleData.gardenCenter3._id)
            .send(sampleData.garden32.services)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                (res.body.gardens.length).should.equal(1);
                (res.body.gardens[0].serviceType).should.equal(CTE.GARDEN_SERVICE_TYPE_SCHEDULED);
                (res.body.gardens[0].service.tasks.length).should.equal(4);
                done();
            })
    })

/*





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
*/


});


// ROUTES FOR OUR API
// =============================================================================
var express    = require('express');
var fs  =   require("fs");
var logger    = require('../2-service/logger');
var userService    = require('../2-service/userService');
var DMService    = require('../2-service/documentManagementService');

var specialTaskService    = require('../2-service/specialTaskFlowService');
var conversationService    = require('../2-service/conversationService')
var gardenCenterService    = require('../2-service/gardenCenterService')

var clientGardenService    = require('../2-service/clientGardenService')
var scheduleService=require("../2-service/scheduleService")
var visitService=require("../2-service/visitService")
var CTE    = require('../4-helpers/constants');

var multer  =  require("multer");

var router = express.Router(); 				// get an instance of the express Router
// multer
var storage = multer.diskStorage({
 destination: function (req, file, cb) {
 cb(null, CTE.TEMP_FILE_STORAGE); // Absolute path. Folder must exist, will not be created for you.
 },
 filename: function (req, file, cb) {
 cb(null, file.fieldname + '-' + Date.now());
 }
 })
 var upload=multer({ storage: storage}).single(CTE.UPLOAD_FILE_FIELD_NAME);



// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// GARDEN CENTERS =========================================================================
router.route('/v1/gardenCenter')
    .get(function(req,res) {
        gardenCenterService.getGardenCenters()
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
    .post(function(req,res) {
        gardenCenterService.addGardenCenter(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/v1/gardenCenter/:gardenCenterId')
        .get(function(req,res) {
            gardenCenterService.getGardenCenterById(req.params.gardenCenterId)
                .then(function (doc) {
                    if(doc==null)
                        res.status(404).send();
                    else
                        res.send(doc);
                }).fail(function (err) {
                    res.status(500).send(err);
            })
        }).put(function(req,res) {
                gardenCenterService.updateGardenCenter(req.params.gardenCenterId,req.body)
                    .then(function (doc) {
                        if(doc==null)
                            res.status(404).send();
                        else
                            res.send(doc);
                    }).fail(function (err) {
                    res.status(403).send(err);
                })
        }).delete(function(req,res) {
        gardenCenterService.deleteGardenCenter(req.params.gardenCenterId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(403).send(err);
        })
})


// garden clients ================================================================

router.route('/v1/clients*')
    .all(function(req,res,next) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        if (gardenCenterdId == null)
            res.status(400).send("Garden Center header not present");
        else
            next();
    })

router.route('/v1/clients')

    .get(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        clientGardenService.getClientsByGardenCenter(gardenCenterdId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
    .post(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        clientGardenService.addClient(gardenCenterdId,req.body)
            .then(function (doc) {
                res.send(doc);
            }).fail(function (err) {
                res.status(500).send(err);
        })
    })


router.route('/v1/clients/:clientId')
    .get(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        clientGardenService.getClientById(gardenCenterdId,req.params.clientId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    }).put(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        clientGardenService.updateClient(gardenCenterdId,req.body)
        .then(function (doc) {
            res.send(doc);
        }).fail(function (err) {
        res.status(500).send(err);
    })
})


router.route('/v1/clients/:clientId/garden')
    .post(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        clientGardenService.addGarden(gardenCenterdId,req.params.clientId,
                                  req.body.gardenAddress,req.body.services)
        .then(function (doc) {
            res.send(doc);
        }).fail(function (err) {
            console.log(err);
            res.status(500).send(err);
    })
})

router.route('/v1/clients/:clientId/garden/:gardenId/address')
    .put(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        clientGardenService.updateGardenAddress(gardenCenterdId,req.params.clientId,
            req.params.gardenId,req.body)
            .then(function (doc) {
                res.send(doc);
            }).fail(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
    })
router.route('/v1/clients/:clientId/garden/:gardenId/services')
    .put(function(req,res) {
        var gardenCenterdId=req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        clientGardenService.updateGardenServices(gardenCenterdId,req.params.clientId,
            req.params.gardenId,req.body)
            .then(function (doc) {
                res.send(doc);
            }).fail(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
    })

// SPECIAL TASKS ======================================================

router.route('/v1/garden*')
    .all(function(req,res,next) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        if (gardenCenterdId == null)
            res.status(400).send("Garden Center header not present");
        else
            next();
    })


router.route('/v1/garden/:gardenId/specialtask')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        specialTaskService.addSpecialTask(gardenCenterdId, req.params.gardenId, req.body.topic)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/v1/garden/:gardenId/specialtask/:taskId')
    .get(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        specialTaskService.getSpecialTask(gardenCenterdId, req.params.gardenId,req.params.taskId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

// visit routes ==================================================================

router.route('/v1/garden/:gardenId/visit')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        var date = req.body.startDate;
        visitService.createVisitFromSchedule(gardenCenterdId, req.params.gardenId, userId,date)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

// CONVERSATIONS ======================================================
router.route('/v1/conversation*')
    .all(function(req,res,next) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID)
        if (gardenCenterdId == null)
            res.status(400).send("Garden Center header not present");
        else
            next();
    })


router.route('/v1/conversation/:conversationId/textComment')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        specialTaskService.addTextComment(gardenCenterdId, req.params.conversationId, userId,req.body.text)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/v1/conversation/:conversationId/askForApprovalComment')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        specialTaskService.addAskForApprovalComment(gardenCenterdId, req.params.conversationId, userId,req.body.text)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/v1/conversation/:conversationId/rejectComment')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        specialTaskService.addRejectionComment(gardenCenterdId, req.params.conversationId, userId,req.body.text)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/v1/conversation/:conversationId/approvalComment')
    .post(function(req, res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        specialTaskService.addApprovalComment(gardenCenterdId, req.params.conversationId, userId,req.body.text)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/v1/conversation/:conversationId/mediaComment')
    .post(function(req, res) {
        upload(req, res, function (err) {
            if (err) {
                res.status(500).send(err);
            } else if(req.file) {
                var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
                var userId = req.header(CTE.HTTP_HEADER_USER);
                specialTaskService.addMediaCommentFromPath(gardenCenterdId, req.params.conversationId, userId, req.body.text,
                        CTE.TEMP_FILE_STORAGE+'/' + req.file.filename,req.file.mimetype)
                    .then(function (docs) {
                        //delete file
                        fs.unlinkSync(CTE.TEMP_FILE_STORAGE+'/' + req.file.filename);
                        res.send(docs);
                    }).fail(function (err) {
                    res.status(500).send(err);
                })
            }
        })
    })
// SCHEDULE ====================================================================

router.route('/v1/schedule/:gardenCenterId')
    .post(function(req,res) {
        scheduleService.buidNewSchedule(req.params.gardenCenterId,req.body.schedule.startDate,req.body.schedule.endDate)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
    .get(function(req,res) {
        scheduleService.getSchedule(req.params.gardenCenterId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })


// visit routes ==================================================================



router.route('/v1/visit/:visitId/task/:taskId/complete')
    .post(function(req,res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        visitService.completeVisitTaskStatus(gardenCenterdId,req.params.visitId,req.params.taskId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/v1/visit/:visitId/task/:taskId/notApplicable')
    .post(function(req,res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        visitService.notApplicableVisitTaskStatus(gardenCenterdId,req.params.visitId,req.params.taskId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/v1/visit/:visitId/close')
    .post(function(req,res) {
        var gardenCenterdId = req.header(CTE.HTTP_HEADER_GARDENCENTERID);
        var userId = req.header(CTE.HTTP_HEADER_USER);
        visitService.closeVisit(gardenCenterdId,req.params.visitId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

/*
router.route('/user')
    .post(function(req, res) {
        console.log(req.body);
        userService.addUser(req.body)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
                res.status(500).send(err);
            })
    })
    .get(function(req,res) {
        userService.getUsers()
        .then(function(docs) {
            res.send(docs);
        }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/user/validate')
    .get(function(req, res) {
        console.log("email=" +req.query.email)
        userService.validate(req.query.email,req.query.password)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/file')
    .post(upload.single("file"),function(req, res) {
        DMService.putFileFromPath(req.file.path,req.file.mimetype,{date:Date()})
        .then(function(doc) {
            res.send(doc.id)
        }).fail(function(err) {
            res.status(500).send(err);
        })
    })
router.route('/file/:fileId')
    .get(function(req, res) {
        console.log("fileId=" +req.params.fileId)
        DMService.getFile(req.params.fileId)
            .then(function(doc) {
                if(doc!=null) {
                    res.setHeader("Content-Type", doc.contentType)
                    res.send(doc.data);
                } else {
                    res.status(404).send("Object " + req.params.fileId + " not found")
                }
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/specialtask/garden/:gardenId')
    .get(function(req, res) {
        var status = req.query.status;
        if(status==CTE.TASK_CREATED) {
            specialTaskService.getSpecialTaskCreated(req.params.gardenId)
                .then(function (docs) {
                    res.send(docs);
                }).fail(function (err) {
                res.status(500).send(err);
            })
        } 
    })
router.route('/specialtask/ready/:gardenId')
    .get(function(req, res) {
        specialTaskService.getSpecialTaskReady(req.params.gardenId)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/specialtask')
    .post(function(req,res) {
        specialTaskService.addSpecialTask(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/specialtask/:taskId')
    .get(function(req, res) {
        specialTaskService.getSpecialTask(req.params.taskId)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/specialtask/:conversationId/comment')
    .put(function(req,res) {
        conversationService.addComment(req.params.conversationId,req.body.text,req.body.userId,req.body.origin)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/conversation/:conversationId/mediaComment')
    .put(function(req,res) {
        conversationService.addMediaCommentFromPath(req.params.conversationId,
                                                     req.file.path,req.file.mimetype,
                                                    req.body.text,req.body.userId,req.body.origin)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/conversation/:conversationId/approvalComment')
    .put(function(req,res) {
        conversationService.addApprovalComment(req.params.conversationId,req.body.userId,req.body.origin)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/conversation/:conversationId/rejectionComment')
    .put(function(req,res) {
        conversationService.addRejectionComment(req.params.conversationId,req.body.userId,req.body.origin)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/conversation/:conversationId/askForApprovalComment')
    .put(function(req,res) {
        conversationService.addAskForApprovalComment(req.params.conversationId, req.body.text,req.body.userId,req.body.origin)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/conversation/garden/:gardenId')
    .get(function(req,res) {
        conversationService.getConversationsByGarden(req.params.gardenId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/conversation/:conversationId')
    .get(function(req,res) {
        conversationService.getConversation(req.params.conversationId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })



router.route('/garden/:gardenId/services')
    .put(function(req,res) {
        gardenService.updateGardenServices(req.params.gardenId,req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/garden')
    .post(function(req,res) {
        gardenService.addGardenCenter(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
    .put(function(req,res) {
        gardenService.updateGardenCenter(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

router.route('/garden/:gardenId')
    .get(function(req,res) {
        gardenService.getGardenCenterById(req.params.gardenCenterId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

//ROUTES: GardenCenterClient
router.route('/gardenCenterClients/:clientId')
    .get(function(req,res) {
        clientGardenService.getClientById(req.params.clientId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/gardenCenterClients')
    .post(function(req,res) {
        clientGardenService.addClient(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
    .put(function(req,res) {
        gardenCenterClientService.updateClient(req.body)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })
router.route('/gardenCenter/:gardenCenterId/clients')
    .get(function(req,res) {
        clientGardenService.getGardenCenterById(req.params.gardenCenterId)
            .then(function (docs) {
                res.send(docs);
            }).fail(function (err) {
            res.status(500).send(err);
        })
    })

*/



/*router.route('/files')
.post(function(req,res) {
    var tmp_path = req.files.file.path;
    var tmp_name = req.files.file.name;
    
    fs.rename(tmp_path, target_path, function(err) {
        if (err) res.status(500).send(err);
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        DMService.putFileFromPath(req.files.file.path
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
});*/




module.exports=router;

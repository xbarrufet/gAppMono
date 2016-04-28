// ROUTES FOR OUR API
// =============================================================================
var express    = require('express');
var logger    = require('../2-service/logger');
var userService    = require('../2-service/userService');
var DMService    = require('../2-service/documentManagementService');
var interventionService    = require('../2-service/interventionService');

var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// visit routes ==================================================================
router.route('/user')
    .post(function(req, res) {
        userService.addUser(req.body.user)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
                res.status(500).send(err);
            })
    })

router.route('/user/validate')
    .get(function(req, res) {
        userService.validate(req.body.email,req.body.password)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.route('/user')
    .post(function(req, res) {
        userService.validate(req.body.email,req.body.password)
            .then(function(docs) {
                res.send(docs);
            }).fail(function(err) {
            res.status(500).send(err);
        })
    })

router.post('/file', multer({
  dest: './imgs',
  rename: function (fieldname, filename) {
    return fieldname;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  limits: {
    files: 1
  },
  onFileUploadComplete: function (file) {    
    console.log(file.fieldname + ' uploaded to  ' + file.path )
    console.log(file.mimetype)
  }
}), function(req, res) {
  // Here you can check `Object.keys(req.files).length`
  // or for specific fields like `req.files.imageField`
  res.redirect('/');
});



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

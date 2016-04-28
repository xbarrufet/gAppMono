var logger = require('../2-service/logger');


var userRepository = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;

    var TYPE_CLIENT="CLIENT";
    var TYPE_GARDEN="GARDEN";

    var _userSchema = new Schema({
        name: String,
        email: { type : String , unique : true, required : true, dropDups: true },
        password:{ type : String, required: true},
        type:{ type:  String , default : TYPE_GARDEN }

    });

    var _model = mongoose.model('Users', _userSchema);

    var _getAllUsers = function(callback) {
        logger.info("start","userRepository","_getAllUsers");
        _model.find({},function(err,docs) {
            if(err) {
                logger.error(err,"userRepository","_getAllUsers");
               callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

    var _getUserById = function(userId,callback) {
        logger.info("start userid="+ userId ,"userRepository","_getUserById");
        _model.findById(userId,function(err,docs) {
            if(err) {
                logger.error(err,"userRepository","_getUserById");
                callback(err,null);
                return;
            }
            callback(null,docs)
        });
        return;
    };

    var _getUserByEmail = function(email,callback) {
        logger.info("start email="+ email ,"userRepository","_getUserByEmail");
        _model.findOne({email: email}, function (err, user) {
            if(err) {
                logger.error(err,"userRepository","_getUserByEmail");
                callback(err,null);
                return;
            }
            callback(null,user)
        });
        return;
    };

    var _validate = function(email,password,callback) {
        logger.info("start email="+ email ,"userRepository","_getUserByEmail");
        _model.findOne({email:email},function(err,user) {
            if (err) {
                logger.error(err, "userRepository", "_validate");
                callback(err, null);
                return;
            }
            if (!user) {
                logger.info("Authentication failed. User not found.", "userRepository", "_validate");
                callback("Authentication failed. User not found.", null);
                return;
            } else {
                if (user.password != password) {
                    logger.info("Authentication failed. Wrong pasword.", "userRepository", "_validate");
                    callback("Authentication failed. Wrong pasword.", null);
                    return;
                }
            }
            callback(null,user);
        });
        return;
    };
    

    var _addUser = function(newUser,callback) {
        logger.info("start","userRepository","_addUser");
        var user =({
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            type:newUser.type
        });
        _model.create(user,
            function (err, vUser) {
                if(err) {
                    logger.error(err,"userRepository","_addUser");
                    callback(err,null);
                    return;
                }
                callback(null,vUser)
            });
        return;
    };

    var _deleteUser =function(userId,callback) {
        logger.info("start userId=" + email,"userRepository","_deleteUser");
        _model.findOneAndRemove(userId, function(err){
                if(err) {
                    logger.error(err,"userRepository","_deleteUser");
                    callback(err,null);
                    return;
                }
                callback(null,vUser)
        });
        return;
    };


    return {
        getAllUsers: _getAllUsers,
        getUserById:_getUserById,
        getUserByEmail:_getUserByEmail,
        deleteUser:_deleteUser,
        addUser:_addUser,
        validate: _validate,

        schema: _userSchema,
        model: _model,
        TYPE_CLIENT:TYPE_CLIENT,
        TYPE_GARDEN:TYPE_GARDEN
    }
}();

module.exports = userRepository;

var express = require('express');
var router = express.Router();
var UserModel = require('./../models/users');
var passwordHash = require('password-hash');

/** 
 * req is input of validate function
 */
function validate(req) {
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password', 'password should not exceed more than 12 characters').isLength({
        max: 12
    });
    req.checkBody('password', 'password must be 8 characters long').isLength({
        min: 8
    });

    var error = req.validationErrors();
    if (error) {
        return error;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} user databasemodel ko instance
 * @param {*} userDetails req.body 
 */
function map_user_req(user, userDetails) {
    // userDetails -- object eg req.body
    // user -- database ko instance eg insert = new instance gareko var 
    // update --- find garera aako user data(user instance
    if (userDetails.firstName) {
        user.firstName = userDetails.firstName
    }
    if (userDetails.lastName) {
        user.lastName = userDetails.lastName
    }
    if (userDetails.email) {
        user.email = userDetails.email
    }
    if (userDetails.phoneNumber) {
        user.phoneNumber = userDetails.phoneNumber
    }
    if (userDetails.username) {
        user.username = userDetails.username
    }
    if (userDetails.password) {
        user.password = passwordHash.generate(userDetails.password)
    }

    return user;

}


module.exports = function() {
    /**
     * 
     */
    router.put('/:id', function(req, res, next) {
        var userId = req.params.id;

        var err = validate(req);
        if (err) {
            return next(err);
        }
        UserModel.findOne({
            _id: userId
        }, function(err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                console.log('user found', user);
                var updatedUser = map_user_req(user, req.body);
                updatedUser.save(function(err, done) {
                    if (err) {
                        console.log('error');
                        return next(err);
                    } else {
                        console.log('everything ok');
                        res.status(200).json(done);
                    }
                });
            } else {
                console.log('user not found');
                res.status(204);
            }
        });
    });
    // TODO
    /**
     * 
     */
    router.delete('/:id', function(req, res, next) {
        var userId = req.params.id;

    });


    /**
     * 
     */
    router.get('/', function(req, res, next) {
        UserModel.find({}).exec(function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            } else {
                res.status(200).json(result);
            }
        })
    });

    return router;

}
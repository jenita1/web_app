var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var Oid = mongodb.ObjectID;
var UserModel = require('./../models/users');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');


function createToken(data, config) {
    var token = jwt.sign({
        user: data._id
    }, config.app.jwtSecret,
    
);
    return token;
}

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

// this router is itself a middleware 
module.exports = function(express, config) {

    var router = express.Router();

    // router.get('/', function(req, res) {
    //     res.send('welcome to hamroo  web app ');
    // })

    router.post('/signup', function(req, res, next) {
        var err = validate(req);
        if (err) {
            return next(err);
        }

        var newUser = new UserModel();

        var mappedUser = map_user_req(newUser, req.body)
        mappedUser.save(function(err, done) {
            if (err) {
                console.log('here');
                return next(err);
            } else {
                console.log('user saved');
                res.status(200).json(done);
            }
        });
    });
    // router.get('/all',function(req,res,next){
    //     var err=validate(err);
    //     if(err){
    //         return next(err);
    //     };
    //     console.log('at get all' );
    // })

    // for login


    router.post('/', function(req, res, next) {
        var err = validate(req);
        if (err) {
            return next(err);
        };
        console.log(' here');

        UserModel.findOne({
            username: req.body.username
        }).exec(function(err, user) {
            if (err) {
                return next(err);
            } else {
                console.log('user found', user);
                if (user) {
                    var matched = passwordHash.verify(req.body.password, user.password);
                    console.log('here matched', matched);
                    if (matched) {
                        var token = createToken(user, config);
                        res.status(200).json({
                            user: user,
                            token: token
                        });

                    } else {
                        next({
                            status: 401,
                            message: 'incorrect password'
                        });
                    }
                } else {
                    res.status(400).json({
                        status: 204,
                        message: 'User not found'
                    });
                }
            }
        });
    });
    router.put('/:id', function(req, res, next) {
        console.log('here at put request');
        var userId = req.params.id;

        var err = validate(req);
        console.log('here', err);


        if (err) {
            return next(err);
        }
        UserModel.findById(userId, function(err, done) {
            if (err) {
                return next(err);
            }
            if (user)
                console.log('user found', user);
            var updateUser = map_user_req(user, req.body);
            updatedUser.save(function(err, done) {
                if (err) {
                    console.log('error');
                    return next(err);

                } else {
                    res.status(200).json(done);
                }
            });



            //  else {
            //     console.log('user not found');
            //     res.status(204);
            // }


        });
    })


    router.delete('/:id', function(req, res, next) {
        var userId = req.params.id;
        var err = validate(req);
        console.log('here', err);


        if (err) {
            return next(err);
        }
        UserModel.findByIdAndRemove(userId, function(err, done) {
            if (err) {
                return next(err);
            } else {
                res.status(200).json(done);
            }
        });
    })
    router.get('/', function(req, res, next) {
        UserModel.find({}).exec(function(err, user) {
            if (err) {
                console.log(err);
                return next(err);
            } else {
                console.log('here');
                res.status(200).json(user);

            }
        })
    });


    router.post('/forgotPassword', function(req, res, next) {

    });
    router.post('/changePassword', function(req, res, next) {

    });
    router.post('/resetPassword', function(req, res, next) {

    });

    return router;
}

// MongoClient.connect(dbUrl, function(err, done) {
//     if (err) {
//         console.log('error connecting to database');
//         return next(err);
//     } else {
//         console.log("successfully connected to database");
//         var db = done.db(config.mongodb.dbName);

//         db.collection('users').find({}).toArray(function(err, user) {
//             if (err) {
//                 console.log('error in saving', err);
//                 return next(err);
//             } else {
//                 if (user.length) {
//                     console.log("user found", user);
//                     res.status(200).json(user);
//                 } else {
//                     console.log('user not found');
//                     // res.status(204).json({
//                     //  msg: 'user not found'
//                     // });
//                     // res.render('index', {
//                     //     errMsg: 'user not found'
//                     // });
//                 }
//             }
//         });

//     }
// });







// router.get('/signup', function(req, res, next) {
//     res.render('signup', {});
//     // res.end('signup');
// });

// router.post('/', function(req, res, next) {

//     var err = validate(req);
//     if (err) {
//         return next(err);
//     };
//     console.log('this is post request under login route', req.body);
//     // res.status(400).send('this is login rotue');

//     MongoClient.connect(dbUrl, function(err, done) {
//         if (err) {
//             console.log('error connecting to database');
//             return next(err);

//             console.log("successfully connected to database");
//             var db = done.db(config.mongodb.dbName);

//             db.collection('users').find({
//                 username: req.body.username
//             }).toArray(function(err, user) {
//                 if (err) {
//                     console.log('error in saving', err);
//                     return next(err);
//                 } else {
//                     if (user.length) {
//                         console.log("user found", user);
//                         res.redirect('/user/dashboard');

//                     } else {
//                         console.log('user not found');
//                         // res.status(204).json({
//                         //  msg: 'user not found'
//                         // });
//                         res.render('index', {
//                             errMsg: 'user not found'
//                         });
//                     }
//                 }
//             });

//         }
//     });
// // });
// router.put('/:id', function(req, res, next) {
//         console.log('here at put request');
//         var userId = req.params.id;

//         var err = validate(req);
//         console.log('here', err);


//         if (err) {
//             return next(err);
//         }
//         UserModel.findById(userId, function(err, done) {
//                 if (err) {
//                     return next(err);
//                 }
//                 if (user) 
//                     console.log('user found',user);
//                 var updateUser =map_user_req(user,req.body);
//                 updatedUser.save(function(err,done){
//                         if(err){
//                             console.log('error');
//                             return next(err);

//                         }
//                         else{
//                             res.status(200).json(done);
//                         }
//                     });


//                  else {
//                     console.log('user not found');
//                     res.status(204);
//                 }


//         });
//     })

// var newUser = new UserModel({});


// MongoClient.connect(dbUrl, function(err, done) {
//     if (err) {
//         console.log('error connecting to database');
//         return next(err);
//     } else {
//         console.log("successfully connected to database");
//         var db = done.db(config.mongodb.dbName);

//         db.collection('users').update({
//             _id: new Oid(userId)
//         }, {
//             $set: req.body

//         }, function(err, done) {
//             if (err) {
//                 console.log('error in saving', err);
//                 return next(err);
//             } else {
//                 console.log("user saved");
//                 // res.redirect('/');
//                 res.status(200).send('ok')


//             }
//         });

//     }
// })

// router.delete('/:id', function(req, res, next) {
//     var userId = req.params.id;
//     MongoClient.connect(dbUrl, function(err, done) {
//         if (err) {
//             console.log('error connecting to database');
//             return next(err);
//         } else {
//             console.log("successfully connected to database");
//             var db = done.db(config.mongodb.dbName);

//             db.collection('users').remove({
//                 _id: new Oid(userId)
//             }, function(err, done) {
//                 if (err) {
//                     console.log('error in deleting ', err);
//                     return next(err);
//                 } else {
//                     console.log("user saved");
//                     // res.redirect('/');
//                     res.status(200).send('ok deleted')


//                 }
//             });

//         }
//     })
// }); router.get('/login', function(req, res, next) {
//     console.log('this is post request under login route');
//     res.end('this is login rotue');
// // }); router.get('/', function(req, res, next) {
//     res.render('index', {
//         title: 'abcd',
//         message: 'welcome to abcd',
//         phone: '9393',
//         email: '399393@lkdjs.com',
//         address: 'kathmandu'
//     }
//     // res.end('this is home page under routing middleware');
// }); router.post('/forgotPassword', function(req, res, next) {

// });
// router.post('/changePassword', function(req, res, next) {

// });
// router.post('/resetPassword', function(req, res, next) {

// });
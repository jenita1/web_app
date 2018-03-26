
var jwt = require('jsonwebtoken');
var config = require('./../config');
var UserModel = require('./../models/users');
module.exports = function(req, res, next){
	var token;
	if (req.headers['x-access-token']) {
		token = req.headers['x-access-token'];
	}
	if (req.headers['Authorization']) {
		token = req.headers['Authorization'];
	}
	if (req.query.token) {
		token = req.query.token
	}
	if (token) {
		jwt.verify(token,config.app.jwtSecret, function(err, done) {
			if (err) {
				next({
					status: 400,
					message: 'Invalid token'
				})
			} else {
				
				UserModel.findOne({
					_id: done.user
				}, function(err, user) {
					if (err) {
						return next(err);
					} else {
						
						req.user = user;
						return next();
					}
				})
			}
		})
	} else {
		next({
			status: 401,
			message: 'Token Not Provided'
		})
	}


}
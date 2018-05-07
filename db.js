var mongoose = require("mongoose");

module.exports = function(config) {
	// locally use gareko ||mlab bata use garne
	mongoose.connect(config.mongodb.dbUrl + '/' + config.mongodb.dbName);
	
	// mongoose.connect(config.mongodb.mlabUrl);
	mongoose.connection.on('error', function(err) {
		console.log('error in connecting', err);
	})
	mongoose.connection.once('open', function() {
		console.log('successfully connected to database :)');
	});
}
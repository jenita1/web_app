var mongoose = require('mongoose');
module.exports = function(config) {
    mongoose.connect(config.mongodb.dbUrl  + '/' + config.mongodb.dbName, function(err, done) {
        if (err) {
            console.log('error connecting to database');
        } else {
            console.log('succesfully connected to database');

        }

    });
}
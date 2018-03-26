var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var db = require('./db')(config);
var morgan = require('morgan');
var expressValidators = require('express-validator');
var path = require('path');
var authRoute = require('./routes/auth')(express, config);
var userRoute = require('./routes/users');
var productRoute=require('./routes/product');

var authentication = require('./middleware/authorize');
var second = require('./middleware/nextMiddleware');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// setting templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressValidators());
app.use('/',authRoute);
app.use('/user',authentication, userRoute);
app.use('/product',authentication,productRoute);
// app.use('/product')


// app.use('/about',second,authentication,userRoute);
// app.use('/contact',second,authentication,userRoute);
// app.use('/home',second,authentication,userRoute);



// app.use(function(req,res,next){
// 	console.log('this is application level middleware');
// 	next('hello');

// });
//error handling middleware
app.use(function(err, req, res, next) {
    console.log('this is error handling middleware');
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || err
    });
});





app.listen(config.app.port, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('server listeining at port ', config.app.port);
    }
});
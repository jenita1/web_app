var express = require('express');
var app = express();
var port = 7070
var file = require('./file')();



app.get('/', function(req, res) {
    res.send('you are at homepage');
});



app.get('/create', function(req, res) {

    var fileName = ' ';
    if (req.query.file) {
        fileName = req.query.file;
    } else {
        fileName = 'sample.txt';
    }


file.write('sample.txt', function(err, result) {
    if (err) {
        console.log('error in writing file', err);
        res.send('err in writing');
    } else {
        console.log('writing file successfull', result);
        res.send('success');
    }
});

app.get('/read', function(req, res) {
    file.read('sample.txt', function(err, result) {
        if (err) {
            console.log('error in reading file', err);
            res.send("error");

        } else {
            console.log('reading file success', result);
            res.send(result);
        }
    });
});

app.get('/rename/:old/:new', function(req, res ) {
            console.log('req.params', req.params);
            var oldName = req.params.old;
            var newName = req.params.new; 
            file.rename('sample.txt', 'sample1.txt',  function(err, result) {
                if (err) {
                    console.log('error in renamning file', err);
                    res.send(err);

                } else {
                    console.log('renaming successfull', result);
                    res.send(result);
                }
            });
        

    });



       
app.listen(port,function(err, result) {
            if (err) {
                console.log(err);
            } 
            else {
                console.log('server listeining at port ',port);

         }
     });


})

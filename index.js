var express = require('express');
var bodyParser = require('body-parser');

var db = require('mysql');
var connection = db.createConnection({
    user: 'bakoliasn',
    host: '127.0.0.1',
    database: 'addressbook'
});

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
    req.accountId = 1;
    next();
});

app.get('/AddressBooks', function(req, res){
    connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId='" + req.accountId +"'", function(err, result){
        if(err) throw err;
    
    res.json(result);
    });
});

var server = app.listen(process.env.PORT, process.env.IP, function () {
 var host = server.address().address;
 var port = server.address().port;

 console.log('Example app listening at http://%s:%s', host, port);
});

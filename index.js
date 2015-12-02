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

app.get('/AddressBooks/:id', function(req, res) {
    connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId='" + req.params.id + "'", function(err, result) {
        if (err) throw err;
        if (req.body.accountId !== req.accountId) {
        res.status(401).send();
    }
        if (result.length < 1) {
            res.send("ERROR 404");
        }
        else {
            res.json(result);
        }
    });
});

app.post('/AddressBooks', function(req, res) {
    if (!req.body.name) {
        res.status(404).send();
    }
    else {
        connection.query("INSERT INTO AddressBook (name, AccountId) VALUES ('" + req.body.name + "','" + req.accountId + "')", function(err, result) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});

app.delete('/delete/AddressBooks/:id', function(req, res){

    connection.query("DELETE FROM AddressBook WHERE AddressBook.id='" + req.params.id + "' AND AddressBook.accountId='" + req.body.accountId + "'", function(err, result){
        if(err) throw err;
        console.log(result);
        res.json(result);
        if(result.affectedRows === 0){
            console.log("\n-----INVALID ACCOUNT ID-----\n");
        }
    });
});







var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

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
    req.accountId = 2;
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

app.delete('/AddressBooks/:id', function(req, res){

    connection.query("DELETE FROM AddressBook WHERE AddressBook.id='" + req.params.id + "' AND AddressBook.accountId='" + req.accountId + "'", function(err, result){
          if(err) throw err;
        if(result.affectedRows === 0){
            res.status(404).send();
            console.log("INVALID ID");
        } else {
        console.log(result);
        res.json(result);
}
    });
});

app.put("/AddressBooks/:id", function (req, res){
    connection.query("UPDATE AddressBook SET name = '" + req.body.name + "' WHERE '" + req.params.id +"' = AddressBook.id AND AddressBook.accountId='" + req.accountId +"'", function(err, result){
    if(err) throw err;
    if(result.affectedRows === 0){
        res.status(404).send();
        console.log(result);
    }else{
        res.json(result);
        console.log(result);
    }
    
    });
});


app.get('/Entry/:id', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressBookId=AddressBook.id WHERE AddressBook.accountId='" + req.accountId + "' AND Entry.id='" + req.params.id + "'", function(err, result) {
        if (err) throw err;
        // if (result.length < 1) {
        //     res.send("ERROR 404");
        //     console.log(result);
        // }
       // else {
            res.json(result);
            console.log(result);
       // }
    });
});












var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

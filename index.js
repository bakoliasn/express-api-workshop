var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');

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

// app.post('/Accounts/login', function(req, res) {
//     connection.query("SELECT * FROM Account WHERE email='" + req.body.email, function(err, result) {
//         if (err) throw err;
//         if (bcrypt.compareSync(req.body.password, result.password)) {
//             var token = bcrypt.
            
//         } else {
//             res.status(404).send("Invalid password!");
//         }
//     });

// });

app.post('/Accounts/userSignUp', function(req, res) {
    var hash = bcrypt.hashSync(req.body.password);
    connection.query("INSERT INTO Account (email, password, createdAt, updatedAt) VALUES ('" + req.body.email + "', '" + hash + "', '" + Date.now() + "', '" + Date.now() + "')", function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});




app.get('/AddressBooks', function(req, res) {
    connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
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
        connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
            if (err) throw err;
            if (result.length < 0) {
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
    }
});

app.delete('/AddressBooks/:id', function(req, res) {
    connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        if (result.length < 0) {
            res.status(404).send();
        }
        else {
            connection.query("DELETE FROM AddressBook WHERE AddressBook.id='" + req.params.id + "' AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
                if (err) throw err;
                if (result.affectedRows === 0) {
                    res.status(404).send();
                    console.log("INVALID ID");
                }
                else {
                    console.log(result);
                    res.json(result);
                }
            });
        }
    });
});

app.put("/AddressBooks/:id", function(req, res) {
    connection.query("SELECT * FROM AddressBook WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        if (result.length < 0) {
            res.status(404).send();
        }
        else {
            connection.query("UPDATE AddressBook SET name = '" + req.body.name + "' WHERE '" + req.params.id + "' = AddressBook.id AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
                if (err) throw err;
                if (result.affectedRows === 0) {
                    res.status(404).send();
                    console.log(result);
                }
                else {
                    res.json(result);
                    console.log(result);
                }
            });

        }
    });
});

app.get('/Entry/:id', function(req, res) {
    connection.query("SELECT Entry.firstName, Entry.lastName, Entry.birthday, Entry.id, Entry.addressBookId FROM Entry JOIN AddressBook ON Entry.addressBookId=AddressBook.id WHERE AddressBook.accountId='" + req.accountId + "' AND Entry.id='" + req.params.id + "'", function(err, result) {
        if (err) throw err;
        if (result.length < 1) {
            res.send("ERROR 404");
            console.log(result);
        }
        else {
            res.json(result);
            console.log(result);
        }
    });
});

//make sure its thier entry with a second query
app.post('/Entry', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressBookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        if (result.length < 0) {
            res.status(404).send();
        }
        else {
            connection.query("INSERT INTO Entry (firstName, lastName, birthday, addressbookId) VALUES ('" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.birthday + "', '" + req.body.addressbookId + "')", function(err, result) {
                if (err) throw err;
                res.json(result);
                console.log(result);
            });
        }
    });
});

app.delete('/Entry/:id', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressBookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        if (result.length < 0) {
            res.status(404).send();
        }
        else {
            connection.query("DELETE Entry FROM Entry, AddressBook WHERE Entry.id='" + req.params.id + "' AND Entry.addressBookId=AddressBook.id AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
                if (err) throw err;
                if (result.affectedRows === 0) {
                    res.status(404).send();
                    console.log("INVALID ID");
                }
                else {
                    console.log(result);
                    res.json(result);
                }
            });
        }


    });
});

app.get('/Entry', function(req, res) {
    connection.query("SELECT Entry.firstName, Entry.lastName, Entry.birthday, Entry.id, Entry.addressBookId FROM Entry JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);

    });
});


app.put('/Entry/:id', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressBookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId, function(err, result) {
        if (err) throw err;
        if (result.length < 0) {
            res.status(404).send();
        }
        else {
            connection.query("UPDATE Entry, AddressBook SET Entry.firstName='" + req.body.firstName + "', Entry.lastName='" + req.body.lastName + "', Entry.birthday='" + req.body.birthday + "' WHERE Entry.id='" + req.params.id + "' AND Entry.addressBookId=AddressBook.id AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
                if (err) throw err;
                if (result.affectedRows === 0) {
                    res.status(404).send();
                    console.log("INVALID ID");
                }
                else {
                    console.log(result);
                    res.json(result);
                }
            });
        }
    });
});


app.get('/Addresses', function(req, res) {
    connection.query("SELECT * FROM Address JOIN Entry ON Entry.id=Address.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/Addresses/:id', function(req, res) {
    connection.query("SELECT * FROM Address JOIN Entry ON Entry.id=Address.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE Address.id='" + req.params.id + "' AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.post('/Addresses', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Entry.id=" + req.body.entryId, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("INSERT INTO Address (Address.entryId, Address.type, Address.line1, Address.line2, Address.city, Address.state, Address.zip, Address.country) VALUES ('" + req.body.entryId + "', '" + req.body.type + "', '" + req.body.line1 + "', '" + req.body.line2 + "', '" + req.body.city + "', '" + req.body.state + "', '" + req.body.zip + "', '" + req.body.country + "')", function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});

app.delete('/Addresses/:id', function(req, res) {
    connection.query("SELECT * FROM Address JOIN Entry ON Address.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Address.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("DELETE FROM Address WHERE id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});

app.put('/Addresses/:id', function(req, res) {
    connection.query("SELECT * FROM Address JOIN Entry ON Address.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Address.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length < 0) {
            res.status(404).send();
        }
        else {
            var validArray = ["entryId", "type", "line1", "line2", "city", "state", "zip", "country"];
            var newArray = [];
            Object.keys(req.body).filter(function(item) {
                return validArray.indexOf(item) >= 0;
            }).map(function(item) {
                newArray.push(item + "='" + req.body[item] + "'");
            });
            var n = newArray.join(', ');

            connection.query("UPDATE Address SET " + n + " WHERE Address.id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });

        }
    });
});

app.get('/Phone', function(req, res) {
    connection.query("SELECT * FROM Phone JOIN Entry ON Entry.id=Phone.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/Phone/:id', function(req, res) {
    connection.query("SELECT * FROM Phone JOIN Entry ON Entry.id=Phone.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE Phone.id='" + req.params.id + "' AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.post('/Phone', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Entry.id=" + req.body.entryId, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("INSERT INTO Phone (Phone.type, Phone.subtype, Phone.phoneNumber) VALUES ('" + req.body.type + "', '" + req.body.subtype + "', '" + req.body.PhoneNumber + "')", function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});



app.delete('/Phone/:id', function(req, res) {
    connection.query("SELECT * FROM Phone JOIN Entry ON Phone.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Phone.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("DELETE FROM Phone WHERE id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});

app.put('/Phone/:id', function(req, res) {
    connection.query("SELECT * FROM Phone JOIN Entry ON Phone.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Phone.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length < 0) {
            res.status(404).send();
        }
        else {
            var validArray = ["type", "subtype", "phoneNumber"];
            var newArray = [];
            Object.keys(req.body).filter(function(item) {
                return validArray.indexOf(item) >= 0;
            }).map(function(item) {
                newArray.push(item + "='" + req.body[item] + "'");
            });
            var n = newArray.join(', ');

            connection.query("UPDATE Phone SET " + n + " WHERE Phone.id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });

        }
    });
});


app.get('/Email', function(req, res) {
    connection.query("SELECT * FROM Email JOIN Entry ON Entry.id=Email.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/Email/:id', function(req, res) {
    connection.query("SELECT * FROM Email JOIN Entry ON Entry.id=Email.entryId JOIN AddressBook ON AddressBook.id=Entry.addressBookId WHERE Email.id='" + req.params.id + "' AND AddressBook.accountId='" + req.accountId + "'", function(err, result) {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send();
            console.log("INVALID ID");
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.post('/Email', function(req, res) {
    connection.query("SELECT * FROM Entry JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Entry.id=" + req.body.entryId, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("INSERT INTO Email (type, address) VALUES ('" + req.body.type + "', '" + req.body.address + "')", function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});

app.delete('/Email/:id', function(req, res) {
    connection.query("SELECT * FROM Email JOIN Entry ON Email.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Email.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length > 0) {
            connection.query("DELETE FROM Email WHERE id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });
        }
        else {
            res.status(404).send();
        }
    });
});

app.put('/Email/:id', function(req, res) {
    connection.query("SELECT * FROM Email JOIN Entry ON Email.entryId=Entry.id JOIN AddressBook ON Entry.addressbookId=AddressBook.id WHERE AddressBook.accountId=" + req.accountId + " AND Email.id=" + req.params.id, function(err, result1) {
        if (err) throw err;
        if (result1.length < 0) {
            res.status(404).send();
        }
        else {
            var validArray = ["type", "address"];
            var newArray = [];
            Object.keys(req.body).filter(function(item) {
                return validArray.indexOf(item) >= 0;
            }).map(function(item) {
                newArray.push(item + "='" + req.body[item] + "'");
            });
            var n = newArray.join(', ');

            connection.query("UPDATE Email SET " + n + " WHERE Email.id=" + req.params.id, function(err, result2) {
                if (err) throw err;
                res.send(result2);
                console.log(result2);
            });

        }
    });
});


var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

const port = 5000;

const SQLUser = process.env.SQLUser;
const SQLPassword = process.env.SQLPassword;

const db = mysql.createConnection({
    host: 'localhost',
    user: SQLUser,
    password: SQLPassword,
    database: 'soen343'
});

db.connect((err) => {
    if (err) {
        console.log("Failed to connect to SQL database...")
        throw err;
    }
    console.log('MySql connected...');
})

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

app.post('/api/users/registerClient', (req, res) => {
            sql = 'SELECT id FROM users WHERE EMail=' + req.body.email;
            console.log("eyyy " + req)
            db.query(sql, (err, result) => {
                if (result == null) {
                    let email = req.body.email;
                    let password = req.body.password;
                    let salt = "bon matin";
                    let firstName = req.body.firstName;
                    let lastName = req.body.lastName;
                    let phone = req.body.phone;
                    let address = req.body.address;

                    sql = 'INSERT INTO users (IsAdmin, EMail, Password, Salt, FirstName, LastName, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    var inserts = [false, email, password, salt, firstName, lastName, phone, address];
                    sql = mysql.format(sql, inserts);
                    db.query(sql, (err, results) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send();
                        } else {
                            res.status(200);
                            res.json(email, firstName, lastName, phone, address);
                        }
                    });
                } else {
                    res.status(400);
                    res.send("Email already registered");
                }
            });
});

app.post('/api/users/registerAdmin', (req, res) => {
    let sql = 'SELECT EMail FROM users WHERE id=' + req.body.id + ' AND auth_token=' + req.body.authToken + ";";
    db.query(sql, (err, result) => {
        if (result != null) {
            let sql = 'SELECT id FROM users WHERE EMail IS ' + req.body.EMail;
            db.query(sql, (err, result) => {
                if (result == null) {
                    let email = req.body.email;
                    let password = req.body.password;
                    let salt = req.body.salt;
                    let firstName = req.body.firstName;
                    let lastName = req.body.lastName;
                    let phone = req.body.phone;
                    let address = req.body.address;

                    let sql = 'INSERT INTO users (IsAdmin, EMail, Password, Salt, FirstName, LastName, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    var inserts = [true, email, password, salt, firstName, lastName, phone, address];
                    sql = mysql.format(sql, inserts);
                    db.query(sql, (err, results) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send();
                        } else {
                            res.status(200);
                            res.json(new Client(email, firstName, lastName, phone, address));
                        }
                    });
                } else {
                    res.status(400);
                    res.send("Email already registered");
                }
            });
        }
    });
});

app.post('/api/users/login', (req, res, next) => {
    let sql = 'SELECT id, IsAdmin, EMail, FirstName, LastName, Phone, Address FROM users WHERE EMail=' + req.body.EMail  +' AND Password=' + req.body.Password;
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send();
        }
        else {
            res.status(200);
            res.json(results);
        }
    });
});

app.get('/api/activeUsers', (req, res) => {
    let sql = 'SELECT FirstName, LastName FROM users WHERE id IN (SELECT id from activeUsers)';
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send();
        }
        else {
            res.status(200);
            res.json(results);
        }
    });
});
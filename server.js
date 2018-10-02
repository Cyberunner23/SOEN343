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

app.post('/api/users/registerUser', (req, res) => {
    sql = "SELECT id FROM users WHERE EMail='" + req.body.EMail + "'";
    console.log('SQL: ' + sql);
    db.query(sql, (err, result) => {
        if (!err) {
            console.log('Result.length: ' + result.length);
            if (result.length === 0) {
                let IsAdmin = req.body.IsAdmin;
                let EMail = req.body.EMail;
                let Password = req.body.Password;
                let salt = "bon matin";
                let FirstName = req.body.FirstName;
                let LastName = req.body.LastName;
                let Phone = req.body.Phone;
                let Address = req.body.Address;
    
                sql = 'INSERT INTO users (IsAdmin, EMail, Password, Salt, FirstName, LastName, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                var inserts = [IsAdmin, EMail, Password, salt, FirstName, LastName, Phone, Address];
                sql = mysql.format(sql, inserts);
                db.query(sql, (err, results) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    } else {
                        res.status(200);
                        res.json({EMail, FirstName, LastName, Phone, Address});
                    }
                });
            } else {
                console.log('Email already exists');
                res.status(400);
                res.send("Email already registered");
            }
        } else {
            console.log('Err: ' + err);
            res.status(500);
            res.send(err);
        }
    });
});

app.post('/api/users/login', (req, res) => {
    let sql = "SELECT id, IsAdmin, EMail, FirstName, LastName, Phone, Address FROM users WHERE EMail='" + req.body.EMail  + "' AND Password='" + req.body.Password + "'";
    console.log('SQL: ' + sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send();
        }
        else {
            console.log('api login success')
            console.log('result: ' + JSON.stringify(result))
            res.status(200);
            res.json(result);
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
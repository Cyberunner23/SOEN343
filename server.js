const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const SQLUser = process.env.SQLUser;
const SQLPassword = process.env.SQLPassword;

const db = mysql.createConnection({
    host     : 'localhost',
    user     : SQLUser,
    password : SQLPassword,
    database : 'soen343'
});

db.connect((err) => {
    if(err) {
        console.log("Failed to connect to SQL database...")
        throw err;
    }
    console.log('MySql connected...');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use(bodyParser.json());

//Test route to ensure that front-end receives from back-end. All this does now
//is return the clients in the 'clients' table.
app.get('/api/clients', (req, res) => {
    let sql = 'SELECT * FROM clients';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

app.post('/api/users/login', (req, res, next) => {
    let sql = 'SELECT id, IsAdmin FROM users WHERE EMail = ' + '\'' + req.body.EMail + '\'' + ' AND Password = '+ '\'' + req.body.Password + '\'';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

app.post('/api/users/new', (req, res, next) => {
    let sql = 'INSERT INTO users (IsAdmin, EMail, Password, Salt, FirstName, LastName, Phone, Address) VALUES ' +
        '(\''+req.body.IsAdmin+'\',\''+req.body.EMail+'\', \''+req.body.Password+'\',\''+req.body.Salt+'\', ' +
        '\''+req.body.FirstName+'\',\''+req.body.LastName+'\', \''+req.body.Phone+'\',\''+req.body.Address+'\')';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

app.get('/api/activeUsers', (req, res) => {
    let sql = 'SELECT FirstName, LastName FROM users WHERE id IN (SELECT id from activeUsers)';
    db.query(sql, (err, results) => {
        if(err) {
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

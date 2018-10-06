const mysql = require('mysql');
const DatabaseConnection = require('../DatabaseConnection');
const db = DatabaseConnection.getInstance();

exports.authenticate = async function (req, res) {
    let query = "SELECT id, IsAdmin, EMail, FirstName, LastName, Phone, Address FROM users WHERE EMail='" + req.body.EMail  + "' AND Password='" + req.body.Password + "'";
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send();
        }
        else if (result.length === 0) {
            console.log('invalid login');
            res.status(400);
            res.send();
        }
        else if (result.length === 1) {
            console.log('login success')
            res.status(200);
            res.json(result[0]);
        }
        else {
            console.log('There is more than one user with the same email and password in the database. Fix it!');
            res.status(500);
            res.send();
        }
    });
}

exports.registerUser = async function (req, res) {
    sql = "SELECT id FROM users WHERE EMail='" + req.body.EMail + "'";
    db.query(sql, (err, result) => {
        if (!err) {
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
                db.query(sql, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send();
                    } else {
                        res.status(200);
                        res.json({id: response.insertId, EMail, FirstName, LastName, Phone, Address});
                    }
                });
            } else {
                console.log('Email already exists');
                res.status(400);
                res.send();
            }
        } else {
            console.log(err);
            res.status(500);
            res.send();
        }
    });
}

exports.activeUsers = async function (req, res) {
    let sql = 'SELECT id, FirstName, LastName FROM users WHERE id IN (SELECT id from activeUsers)';
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
}
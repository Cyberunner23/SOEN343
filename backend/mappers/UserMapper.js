const mysql = require('mysql');
const DatabaseConnection = require('../DatabaseConnection');
const User = require('../business objects/user').User;

const db = DatabaseConnection.getInstance();

const Exceptions = Object.freeze({
    'InternalServerError' : 0
});
exports.Exceptions = Exceptions;

class UserMapper {
    async getUsers (json) {
        return new Promise((resolve, reject) => {
            var query = "SELECT id, is_admin, email, first_name, last_name, phone, address FROM users WHERE ";

            var keys = Object.keys(json);
            for(var i = 0; i < keys.length -1; i++) {
                query += keys[i] + "='" + json[keys[i]] + "' AND ";
            }
            var last = keys.length -1;
            query += keys[last] + "='" + json[keys[last]] + "'";
            
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(getUserArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            });
        })
    }

    async getActiveUsers () {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT id, is_admin, email, first_name, last_name, phone, address FROM users WHERE id IN (SELECT id from activeUsers)';
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
                else {
                    resolve(getUserArray(result));
                }
            });
        })
    }
    
    async addUser (json) {
        return new Promise((resolve, reject) => {

            let is_admin = json.is_admin;
            let email = json.email;
            let password = json.password;
            let salt = "bon matin";
            let first_name = json.first_name;
            let last_name = json.last_name;
            let phone = json.phone;
            let address = json.address;

            var query = 'INSERT INTO users (is_admin, email, password, salt, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            var inserts = [is_admin, email, password, salt, first_name, last_name, phone, address];
            query = mysql.format(query, inserts);

            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    resolve(new User({id: response.insertId, is_admin, email, first_name, last_name, phone, address}));
                }
            });
        })
    }
}

const instance = new UserMapper();

getUserArray = function (jsonUsers) {
    var users = [];
    jsonUsers.forEach((jsonUser) => {
        users.push(new User(jsonUser));
    })
    return users;
}

exports.getInstance = function () {
    return instance;
}
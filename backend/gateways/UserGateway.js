const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const User = require('../business_objects/user').User;
const ActiveUser = require('../business_objects/activeUser').ActiveUser;
const Exceptions = require('../Exceptions').Exceptions;

class UserGateway {

    async loadUsers() {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM users";
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(getUserArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }

    async loadActiveUsers() {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM activeUsers';
            db.query(sql, (err, result) => {
                if (!err) {
                    resolve(getActiveUserArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            });
        })
    }

    async addUser(jsonUser) {
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO users (is_admin, email, password, salt, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            var inserts = [jsonUser.is_admin, jsonUser.email, jsonUser.password, jsonUser.salt,
                           jsonUser.first_name, jsonUser.last_name, jsonUser.phone, jsonUser.address];
            query = mysql.format(query, inserts);
            
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    jsonUser.id = response.insertId;
                    var newUser = new User(jsonUser);
                    resolve (newUser);
                }
            });
        })
    }
    
    async addActiveUser(jsonActiveUser) {
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO activeUsers (id, timestamp) VALUES (?, ?)'
            var inserts = [jsonActiveUser.id, jsonActiveUser.timestamp];
            query = mysql.format(query, inserts);
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
                else {
                    jsonActiveUser.index = response.insertId;
                    var newActiveUser = new ActiveUser(jsonActiveUser);
                    resolve (newActiveUser);
                }
            })
        })
    }
    
    async updateActiveUser(jsonActiveUser) {
        return new Promise((resolve, reject) => {
            var query = "UPDATE activeUsers SET timestamp=? WHERE id=?";
            var inserts = [jsonActiveUser.timestamp, jsonActiveUser.id];
            query = mysql.format(query, inserts);
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
                else {
                    resolve();
                }
            })
        })
    }
    
    async deleteActiveUser(idsToRemove) {
        return new Promise((resolve, reject) => {
            var query;
            if (idsToRemove) {
                query = 'DELETE FROM activeUsers WHERE id IN (' + idsToRemove.join() + ')';
            }
            else {
                query = 'DELETE FROM activeUsers'
            }
        
            db.query(query, (err, result) => {
                if (!err) {
                    resolve();
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
}

const instance = new UserGateway();
exports.getInstance = () => {
    return instance;
}

getUserArray = (jsonUsers) => {
    var users = [];
    jsonUsers.forEach((jsonUser) => {
        users.push(new User(jsonUser));
    })
    return users;
}

getActiveUserArray = (jsonUsers) => {
    var users = [];
    jsonUsers.forEach((jsonUser) => {
        users.push(new ActiveUser(jsonUser));
    })
    return users;
}
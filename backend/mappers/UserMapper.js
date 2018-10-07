const mysql = require('mysql');
const DatabaseConnection = require('../DatabaseConnection');
const User = require('../business_objects/user').User;

const db = DatabaseConnection.getInstance();

const Exceptions = Object.freeze({
    'InternalServerError' : 0
});
exports.Exceptions = Exceptions;

class UserMapper {

    constructor() {
        // The InventoryMapper won't need to load any resources from the database for iteration 3
        // Just initiazile empty arrays instead (one for each item type)
        loadUsers().then((users) => {
            this.users = users;
        });
        loadActiveUsers().then((users) => {
            this.activeUsers = users;
        });
    }

    // The InventoryMapper will need 4 get methods (one for each item type)
    async getUsers (jsonCriteria) {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(jsonCriteria);
            var filteredUsers =  this.users.filter(user => {
                for (var key of keys) {
                    if (user[key] !== jsonCriteria[key]) {
                        return false; // filter out
                    }
                }
                return true; // keep
            })
            resolve(filteredUsers);
        })
    }

    // Doesn't apply to InventoryMapper
    async getActiveUsers () {
        return new Promise((resolve, reject) => {
            resolve(this.activeUsers);
        })
    }
    
    // The InventoryMapper will need 4 add methods (one for each item type)
    async addUser (jsonUser) {
        return new Promise((resolve, reject) => {

            // InventoryMapper doesn't require persistence for iteration 3 (make sure to still read all nested comments!)
            var query = 'INSERT INTO users (is_admin, email, password, salt, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            var inserts = [jsonUser.is_admin, jsonUser.email, jsonUser.password, jsonUser.salt,
                           jsonUser.first_name, jsonUser.last_name, jsonUser.phone, jsonUser.address];
            query = mysql.format(query, inserts);
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    // The id is acquired from the DB. This won't be possible for InventoryMapper for iteration 3
                    jsonUser.id = response.insertId;
            
                    // This is basically all InventoryMapper.addItem methods need for iteration 3
                    var newUser = new User(jsonUser);
                    this.users.push(newUser); // add user to cache
                    resolve (newUser);
                }
            });
        })
    }
}

getUserArray = (jsonUsers) => {
    var users = [];
    jsonUsers.forEach((jsonUser) => {
        users.push(new User(jsonUser));
    })
    return users;
}

loadUsers = async () => {
    return new Promise((resolve, reject) => {
        var query = "SELECT id, is_admin, email, password, salt, first_name, last_name, phone, address FROM users";
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

loadActiveUsers = async () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT id, is_admin, email, password, salt, first_name, last_name, phone, address FROM users WHERE id IN (SELECT id from activeUsers)';
        db.query(sql, (err, result) => {
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

const instance = new UserMapper();

exports.getInstance = () => {
    return instance;
}

// if (json) {
//     query += " WHERE ";

//     var keys = Object.keys(json);
//     for(var i = 0; i < keys.length -1; i++) {
//         query += keys[i] + "='" + json[keys[i]] + "' AND ";
//     }
//     var last = keys.length -1;
//     query += keys[last] + "='" + json[keys[last]] + "'";
// }
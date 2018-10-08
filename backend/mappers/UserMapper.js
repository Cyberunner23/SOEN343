const mysql = require('mysql');
const DatabaseConnection = require('../DatabaseConnection');
const User = require('../business_objects/user').User;
const ActiveUser = require('../business_objects/activeUser').ActiveUser;

const Exceptions = require('../Exceptions').Exceptions;

const db = DatabaseConnection.getInstance();

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
    getUsers (jsonCriteria) {
        if (jsonCriteria) {
            var keys = Object.keys(jsonCriteria);
            var filteredUsers =  this.users.filter(user => {
                for (var key of keys) {
                    if (user[key] !== jsonCriteria[key]) {
                        return false; // filter out
                    }
                }
                return true; // keep
            })
            return filteredUsers;
        }
        else {
            return this.users;
        }
    }

    // Doesn't apply to InventoryMapper
    getActiveUsers (jsonCriteria) {
        if (jsonCriteria) {
            var keys = Object.keys(jsonCriteria);
            var filteredActiveUsers =  this.activeUsers.filter(activeUser => {
                for (var key of keys) {
                    if (activeUser[key] !== jsonCriteria[key]) {
                        return false; // filter out
                    }
                }
                return true; // keep
            })
            return filteredActiveUsers;
        }
        else {
            return this.activeUsers;
        }
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

    async addActiveUser (jsonActiveUser) {
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
                    this.activeUsers.push(newActiveUser);
                    resolve (newActiveUser);
                }
            })
        })
    }

    async updateActiveUser (jsonActiveUser) {
        return new Promise((resolve, reject) => {
            var activeUsersWithMatchingId = this.activeUsers.filter(user => {
                return user.id === jsonActiveUser.id;
            })
            if (activeUsersWithMatchingId.length === 0) {
                console.log('Could not update the requested active user because it does not exist');
                reject(Exceptions.InternalServerError);
            }
            else if (activeUsersWithMatchingId.length > 1) {
                console.log('There is more than one activeUser with the same id. Fix this!')
                reject(Exceptions.InternalServerError);
            }
            else { // activeUsersWithMatchingId.length must be 1
                var query = "UPDATE activeUsers SET timestamp=? WHERE id=?";
                var inserts = [jsonActiveUser.timestamp, jsonActiveUser.id];
                query = mysql.format(query, inserts);
                db.query(query, (err, response) => {
                    if (err) {
                        console.log(err);
                        reject(Exceptions.InternalServerError);
                    }
                    else {
                        var index = this.activeUsers.findIndex(user => {
                            return user.id === jsonActiveUser.id;
                        })
                        this.activeUsers[index].timestamp = jsonActiveUser.timestamp;
                        resolve(this.activeUsers[index]);
                    }
                })
            }
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

getActiveUserArray = (jsonUsers) => {
    var users = [];
    jsonUsers.forEach((jsonUser) => {
        users.push(new ActiveUser(jsonUser));
    })
    return users;
}

loadActiveUsers = async () => {
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
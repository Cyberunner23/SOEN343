const userGateway = require('../gateways/UserGateway').getInstance();
const Exceptions = require('../Exceptions').Exceptions;

class UserMapper {

    constructor() {
        // The InventoryMapper won't need to load any resources from the database for iteration 3
        // Just initiazile empty arrays instead (one for each item type)
        userGateway.loadUsers().then((users) => {
            this.users = users;
        });
        userGateway.loadActiveUsers().then((users) => {
            this.activeUsers = users;
        });
    }

    // The InventoryMapper will need 4 get methods (one for each item type)
    getUsers (callback) {
        if (callback) {
            var filteredUsers =  this.users.filter(user => {
                return callback(user);
            })
            return filteredUsers;
        }
        else {
            return this.users;
        }
    }

    // Doesn't apply to InventoryMapper
    getActiveUsers (callback) {
        if (callback) {
            var filteredActiveUsers =  this.activeUsers.filter(activeUser => {
                return callback(activeUser);
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
            userGateway.persistAddUser(jsonUser)
            .then(newUser => {
                this.users.push(newUser);
                resolve(newUser);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async addActiveUser (jsonActiveUser) {
        return new Promise((resolve, reject) => {
            userGateway.persistAddActiveUser(jsonActiveUser)
            .then(newActiveUser => {
                this.activeUsers.push(newActiveUser);
                resolve(newActiveUser);
            })
            .catch(exception => {
                reject(exception);
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
                userGateway.persistUpdateActiveUser(jsonActiveUser)
                .then(() => {
                    var index = this.activeUsers.findIndex(user => {
                        return user.id === jsonActiveUser.id;
                    })
                    this.activeUsers[index].timestamp = jsonActiveUser.timestamp;
                    resolve(this.activeUsers[index]);
                })
                .catch(exception => {
                    reject(exception);
                })
            }
        })
    }

    async removeActiveUsers (callback) {
        return new Promise((resolve, reject) => {
            var removedUsers = [];
            var idsToRemove = [];

            if (callback) {

                removedUsers = this.activeUsers.filter(user => {
                    return callback(user);
                })

                this.activeUsers = this.activeUsers.filter(user => {
                    return ! callback(user);
                })

                if (removedUsers.length > 0) {
                    removedUsers.forEach(user => {
                        idsToRemove.push(user.id);
                    })
                }
                else {
                    // no user to remove
                    resolve([]);
                    return;
                }
            }
            else {
                console.log('Removing all active users. Hopefully this is actually what you wanted to do.');
                removedUsers = this.activeUsers.splice(0, this.activeUsers.length);
                removedUsers.forEach(user => {
                    idsToRemove.push(user.id);
                })
            }

            userGateway.persistDeleteActiveUser(idsToRemove)
            .then(() => {
                resolve(removedUsers);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }
}

const instance = new UserMapper();
exports.getInstance = () => {
    return instance;
}
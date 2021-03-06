const UserMapper = require('../mappers/UserMapper');
const Exceptions = require('../Exceptions').Exceptions;
const isString = require('util').isString;

const userMapper = UserMapper.getInstance();

// Every second, logout users that haven't been active for at least [maxInactivitySeconds]
startAutoLogout = () => {
    const maxInactivitySeconds = 30; // The max inactivity period is small to speed up testing. We can change this later.
    setInterval(() => {
        userMapper.removeActiveUsers(user => {
            currentMilliseconds = new Date().getTime(); // creating a new date initializes time to current time
            return (currentMilliseconds - user.timestamp.getTime()) >= maxInactivitySeconds * 1000; // getTime() returns milliseconds
        })
        .then(activeUsers => {
            activeUsers.forEach(user => {
                console.log('User with id=' + user.id + ' automatically removed from active users');
            })
        })
        .catch(exception => {
            console.log('An exception occured when attempting to run auto-logout feature');
        })
    }, 1000) // every 1000 milliseconds
}

class UserController {

    constructor() {
        startAutoLogout();
    }

    async authenticate (req, res) {
        var users = userMapper.getUsers(user => {
            return(
                user.email === req.body.email &&
                user.password === req.body.password
            );
        });
        if (users.length === 0) {
            console.log('invalid login');
            res.status(400);
            res.json({err: 'Invalid credentials'});
        }
        else if (users.length === 1) {
            var user = users[0];
            refreshActivityStatus(user.id) // we will use authToken in the future
            .then(() => {
                console.log('login success');
                res.status(200);
                res.json(convertToFrontendUser(user));
            })
            .catch(exception => {
                handleException(res, exception);
            })
        }
        else {
            console.log('There is more than one user with the same email and password in the database. Fix it!');
            handleException(res, Exceptions.InternalServerError);
        }
    }
    
    async registerUser (req, res) {
        identifyUser(req.body.authToken)
        .then(user => {
            if (!user.is_admin) {
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            var body = req.body;
            // validate request
            if (
                ! (
                    isNonEmptyString(body.email) &&
                    isNonEmptyString(body.password) &&
                    isNonEmptyString(body.first_name) &&
                    isNonEmptyString(body.last_name) &&
                    isNonEmptyString(body.phone) &&
                    isNonEmptyString(body.address)
                )
            ) {
                console.log('One or more registerUser fields were null or empty');
                handleException(res, Exceptions.InvalidRequestBody);
                return;
            }
            var result = userMapper.getUsers(user => {
                return (
                    user.email === req.body.email
                )
            });
            if (result.length === 0) {
                req.body.salt = 'bon matin'; // change this when encryption is implemented
                userMapper.addUser(req.body)
                .then((user) => {
                    res.status(200);
                    res.json(convertToFrontendUser(user));
                })
                .catch((exception) => {
                    handleException(res, exception);
                });
            } else {
                console.log('email already exists');
                handleException(res, Exceptions.EmailAlreadyUsed);
            }
        })
        .catch(exception => {
            handleException(res, exception);
        })
    }
    
    async activeUsers (req, res) {
        identifyUser(req.body.authToken)
        .then(user => {
            if (!user.is_admin) {
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            var activeUsers = userMapper.getActiveUsers(); // activeUsers only have index, id and timestamp. Must retrieve user info before sending to frontend
            var userPairs = [];
            
            activeUsers.forEach(activeUser => {
                var userArray = userMapper.getUsers(user => {
                    return (
                        user.id === activeUser.id
                    )
                });
                if (userArray.length === 1) {
                    var userPair = {user: userArray[0], activeUser};
                    userPairs.push(userPair);
                }
                else {
                    console.log('There should be exactly 1 user with the supplied id. Something is wrong.');
                    throw Exceptions.InternalServerError;
                }
        
            })
            res.status(200);
            res.json(convertToFrontendActiveUsers(userPairs));
        })
        .catch(exception => {
            handleException(res, exception);
        })
    }
    
    async logout (req, res) {
        identifyUser(req.body.authToken)
        .then(userToLogout => {
            userMapper.removeActiveUsers(user => {
                return user.id === userToLogout.id;
            })
            .then(() => {
                console.log('logout success');
                res.status(200);
                res.send();
            })
            .catch(exception => {
                handleException(res, exception);
            })
        })
        .catch(exception => {
            handleException(res, exception);
        })
    }
}

const instance = new UserController()
exports.getInstance = () => {
    return instance;
}

handleException = function (res, exception) {
    console.log('An exception occured');
    var message;
    switch(exception) {
        case Exceptions.InvalidRequestBody:
            res.status(400);
            message = 'Invalid request body';
            break;
        case Exceptions.Unauthorized:
            res.status(401);
            message = 'Unauthorized';
            break;
        case Exceptions.EmailAlreadyUsed:
            res.status(400);
            message = 'Email already used';
            break;
        case Exceptions.InternalServerError:
        default:
            res.status(500);
            message = 'Internal Server Error';
            break;
    }
    res.json({err: message});
}

convertToFrontendUsers = (users) => {
    try {
        frontendUsers = [];
        users.forEach((user) => {
            frontendUsers.push(convertToFrontendUser(user));
        })
        return frontendUsers;
    }
    catch (err) {
        console.log(err);
    }
}

convertToFrontendActiveUsers = (userPairs) => {
    try {
        frontendUsers = [];
        userPairs.forEach(pair => {
            frontendUsers.push(convertToFrontendActiveUser(pair));
        })
        return frontendUsers;
    }
    catch (err) {
        console.log(err);
    }
}

convertToFrontendUser = (user) => {
    let is_admin = user.is_admin;
    let email = user.email;
    let first_name = user.first_name;
    let last_name = user.last_name;
    let phone = user.phone;
    let address = user.address;
    let authToken = user.id; // use the id for now
    return (
        {is_admin, email, first_name, last_name, phone, address, authToken}
    )
}

convertToFrontendActiveUser = pair => {
    var jsonUser = convertToFrontendUser(pair.user);
    jsonUser.timestamp = pair.activeUser.timestamp.toLocaleString();
    return jsonUser;
}

identifyUser = async authToken => {
    return new Promise((resolve, reject) => {
        var users = userMapper.getUsers(user => {
            return user.id === authToken; // needs change -> get user id from auth token instead of using authToken directly
        })
        if (users.length === 0) {
            reject(Exceptions.Unauthorized);
        }
        else if (users.length > 1) {
            reject(Exceptions.InternalServerError);
        }
        else {
            var user = users[0];
            refreshActivityStatus(user.id)
            .then(() => {
                resolve(user);
            })
            .catch(exception => {
                reject(exception);
            })
        }
    })

}
exports.identifyUser = identifyUser;

refreshActivityStatus = async (id) => { // use id for now. In the future, possibly use authToken
    return new Promise((resolve, reject) => {
        var activeUsersArray = userMapper.getActiveUsers(activeUser => {
            return (
                activeUser.id === id
            )
        });
    
        if (activeUsersArray.length > 1) {
            console.log('There is more than one active user with the same id in the database. Fix it!');
            reject(Exceptions.InternalServerError);
            return; // terminate callback
        }
    
        var timestamp = new Date(new Date().getTime());
    
        var jsonActiveUser = ({id, timestamp});
    
        var promise;
        if (activeUsersArray.length === 0) {
            // add new active user
            promise = userMapper.addActiveUser(jsonActiveUser);
        }
        else { // activeUsers.length must be 1
            // update timestamp
            promise = userMapper.updateActiveUser(jsonActiveUser);
        }
    
        promise.then(activeUser => {
            // If nothing went wrong when adding/updating activeUser
            resolve(activeUser);
        })
        .catch(exception => {
            console.log('promise exception');
            reject(exception);
        })
    })
}

isNonEmptyString = input => {
    return isString(input) && input.length != 0;
}
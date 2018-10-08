const UserMapper = require('../mappers/UserMapper');
const Exceptions = require('../Exceptions').Exceptions;
const cron = require('node-cron');

// every minute, logout users that haven't been active for at least x minutes
const x = 5;
cron.schedule("* * * * *", () => {
    userMapper.removeActiveUsers(user => {
        var currentMilliseconds = new Date().getTime(); // creating a new date initializes time to current time
        return (currentMilliseconds - user.timestamp.getTime()) >= x * 60 * 1000; // getTime() returns milliseconds
    })
    .then(activeUsers => {
        activeUsers.forEach(user => {
            console.log('User with id=' + user.id + ' automatically logged out');
        })
    })
    .catch(exception => {
        console.log('An exception occured when attempting to run auto-logout feature');
    })
});

const userMapper = UserMapper.getInstance();

exports.authenticate = async (req, res) => {
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
        console.log('login success')
        var user = users[0];
        var activeUsersArray = userMapper.getActiveUsers(activeUser => {
            return (
                activeUser.id === user.id
            )
        });

        if (activeUsersArray.length > 1) {
            console.log('There is more than one active user with the same id in the database. Fix it!');
            handleException(res, Exceptions.InternalServerError);
            return; // terminate callback
        }

        var timestamp = new Date(new Date().getTime());

        var jsonActiveUser = {id: user.id, timestamp};

        var promise;
        if (activeUsersArray.length === 0) {
            // add new active user
            promise = userMapper.addActiveUser(jsonActiveUser);
        }
        else { // activeUsers.length must be 1
            // update timestamp
            promise = userMapper.updateActiveUser(jsonActiveUser);
        }

        promise.then(() => {
            // If nothing went wrong when adding/updating activeUser
            res.status(200);
            res.json(convertToFrontendUser(user))
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

exports.registerUser = async function (req, res) {
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
}

exports.activeUsers = async (req, res) => {
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
}

exports.logout = async (req, res) => {

    var userArray = userMapper.getUsers(user => {
        return (
            user.email === req.body.email
        )
    });
    if (userArray.length > 1) {
        console.log('There is more than 1 user with the same email. Fix it!');
        handleException(res, Exceptions.InternalServerError);
    }
    else if (userArray.length === 0) {
        console.log('The requested user does not exist');
        handleException(res, Exceptions.UserDoesNotExist);
    }
    else { // userArray.length must be 1
        var userToLogout = userArray[0];
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
    }
}

handleException = function (res, exception) {
    console.log('An exception occured');
    var message;
    switch(exception) {
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
    return (
        {is_admin, email, first_name, last_name, phone, address}
    )
}

convertToFrontendActiveUser = pair => {
    var jsonUser = convertToFrontendUser(pair.user);
    jsonUser.timestamp = pair.activeUser.timestamp.toLocaleString();
    return jsonUser;
}

asyncForEach = async (array, callback) => {
    for (var i = 0; i < array.length; i++) {
        await callback(array[i]);
    }
}
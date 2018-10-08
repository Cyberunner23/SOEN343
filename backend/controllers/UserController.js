const UserMapper = require('../mappers/UserMapper');

const userMapper = UserMapper.getInstance();

exports.authenticate = async function (req, res) {

    userMapper.getUsers({email: req.body.email, password: req.body.password})
    .then((users) => {
        if (users.length === 0) {
            console.log('invalid login');
            res.status(400);
            res.json({err: 'Invalid credentials'});
        }
        else if (users.length === 1) {
            console.log('login success')

            var user = users[0];

            userMapper.getActiveUsers({id: user.id})
            .then(activeUsersArray => {

                if (activeUsersArray.length > 1) {
                    console.log('There is more than one active user with the same id in the database. Fix it!');
                    handleException(res, Exception.InternalServerError);
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
            })
            .catch(exception => {
                handleException(res, exception);
            })

        }
        else {
            console.log('There is more than one user with the same email and password in the database. Fix it!');
            handleException(res, Exception.InternalServerError);
        }
    })
    .catch((exception) => {
        handleException(res, exception);
    });
}

exports.registerUser = async function (req, res) {
    userMapper.getUsers({email: req.body.email})
    .then((result) => {
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
            handleException(res, Exception.InternalServerError);
        }
    })
    .catch((exception) => {
        handleException(res, exception);
    });
}

exports.activeUsers = async (req, res) => {
    userMapper.getActiveUsers()
    .then(async activeUsers => { // activeUsers only have index, id and timestamp. Must convert to users before sending to frontend
        var users = [];
        var success = true;
        await asyncForEach(activeUsers, async activeUser => {
            userMapper.getUsers({id: activeUser.id})
            .then(result => {
                if (result.length === 1) {
                    users.push(result[0]);
                }
                else {
                    console.log('There should be exactly 1 user with the supplied id. Something is wrong.');
                    handleException(res, Exception.InternalServerError);
                    success = false;
                    return;
                }
            })
            .catch(exception => {
                handleException(exception);
                success = false;
                return;
            })
        })
        if (success) {
            res.status(200);
            res.json(convertToFrontendUsers(users));
        }
    })
    .catch((exception) => {
        handleException(res, exception);
    });
}

handleException = function (res, exception) {
    switch(exception) {
        case UserMapper.Exceptions.UserNotFound:
            res.status(400);
            res.json('User not found');
            break;
        case UserMapper.Exceptions.InternalServerError:
        default:
            res.status(500);
            res.json('Internal Server Error');
    }
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

asyncForEach = async (array, callback) => {
    console.log('for each');
    try {
        for (var i = 0; i < array.length; i++) {
            await callback(array[i]);
        }
    }
    catch (e) {
        console.log(e);
    }
}
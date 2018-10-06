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
            res.status(200);
            res.json(users[0]);
        }
        else {
            console.log('There is more than one user with the same email and password in the database. Fix it!');
            res.status(500);
            res.send({err: 'Internal server error'});
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
            console.log('here here');
            userMapper.addUser(req.body)
            .then((user) => {
                res.status(200);
                res.json(user);
            })
            .catch((exception) => {
                handleException(res, exception);
            });
        } else {
            console.log('email already exists');
            res.status(400);
            res.send();
        }
    })
    .catch((exception) => {
        handleException(res, exception);
    });
}

exports.activeUsers = async function (req, res) {
    userMapper.getActiveUsers()
    .then((activeUsers) => {
        res.status(200);
        res.json(activeUsers);
    })
    .catch((exception) => {
        handleException(res, exception);
    });
}

handleException = function (res, exception) {
    switch(exception) {
        case UserMapper.Exceptions.InternalServerError:
        default:
            res.status(500);
            res.send();
    }
}
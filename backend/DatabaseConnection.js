const mysql = require('mysql');

const SQLUser = process.env.SQLUser;
const SQLPassword = process.env.SQLPassword;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: SQLPassword,
    database: 'soen343'
});

exports.getInstance = function () {
    return connection;
}
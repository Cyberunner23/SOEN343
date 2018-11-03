const mysql = require('mysql');
const utils = require('../database_scripts/auxiliary-scripts/utilities.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: utils.getPropertyIfExists(process.env, 'SQLUser', 'root'),
    password: utils.getPropertyIfExists(process.env, 'SQLPassword', ''),
    database: 'soen343',
    multipleStatements: true
});

exports.getInstance = function () {
    return connection;
}
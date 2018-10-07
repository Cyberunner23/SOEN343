/**
 * High level commands which allow the deletion of tables and the creation of
 * tables based a JSON table format
 * 
 * @author Paul Lane
 * @since 7.10.2018
 */

const utilities = require('./utilities.js');
const sqlUtils = require('./sql-utilities');
const sqlGen = require('./sql-generators.js');

module.exports.createTables = createTables;
module.exports.dropAllTables = dropAllTables;

/**
 * Create the supplied JSON tables in the given database.
 * 
 * @param {string} databaseName - Database in which to create the tables
 * @param {*[]} tables - JSON tables to create
 */
async function createTables(databaseName, tables) {
    // Prepare Queries
    let queries = [];
    queries.push('SET AUTOCOMMIT = 0;');
    queries.push('START TRANSACTION;');
    queries = queries.concat(prepareCreateQueries(tables));
    queries.push('COMMIT;');

    let connection = await defaultedMySQLAuth(databaseName);

    // Execute Queries
    let queriesLength = queries.length;
    for(let i = 0; i < queriesLength; ++i) {
        await sqlUtils.query(connection, queries[i]);
    }

    // Disconnect queries
    await sqlUtils.disconnectMySQL(connection);
}

/**
 * Drop all the tables from the database
 * 
 * @param {string} databaseName - Database to drop all tables from
 */
async function dropAllTables(databaseName) {
    // Note: We connect first to query the names of all the tables
    let connection = await defaultedMySQLAuth(databaseName);

    // Prepare the queries
    let queries = [];
    queries.push('SET FOREIGN_KEY_CHECKS = 0;');
    queries = queries.concat(await sqlGen.generateAllTableDropStatements(connection, databaseName));
    queries.push('SET FOREIGN_KEY_CHECKS = 1;');

    // Execute the queries
    let queriesLength = queries.length;
    for(let i = 0; i < queriesLength; ++i) {
        await sqlUtils.query(connection, queries[i]);
    }

    // Disconnect from database
    await sqlUtils.disconnectMySQL(connection);
}

/**
 * Returns the generated list of all queries necessary to create the supplied
 * JSON tables in a database
 * 
 * @param {*} tables - JSON tables to generate create queries for
 */
function prepareCreateQueries(tables) {
    let queries = [];

    // Enqueue table create and primary key queries
    let tablesLength = tables.length;
    for(let i = 0; i < tablesLength; ++i) {
        console.log(`Generating queries for table '${tables[i].tableName}'`);
        queries.push(sqlGen.generateTableCreateStatement(tables[i]));
        queries.push(sqlGen.generatePrimaryKeyStatment(tables[i]));
        if(tables[i].hasOwnProperty('autoIncrement')) {
            queries.push(sqlGen.generateAutoIncrementStatement(tables[i]));
        }
    }

    // Then once all tables are created, enqueue foreign key queries
    for(let i = 0; i < tablesLength; ++i) {
        if(tables[i].hasOwnProperty('foreignKeys')) {
            queries = queries.concat(sqlGen.generateForeignKeyStatements(tables[i]));
        }
    }

    return queries;
}

/**
 * Create and start a MySQL connection with credentials supplied via the 
 * environment variables 'SQLUser' and 'SQLPassword'. If these values are not
 * set, then 'root' and '' are used for the user and password respectively
 * 
 * @param {string} databaseName - The database to connect to
 */
async function defaultedMySQLAuth(databaseName) {
    let SQLUser = utilities.getPropertyIfExists(process.env, 'SQLUser', 'root');
    let SQLpassword = utilities.getPropertyIfExists(process.env, 'SQLPassword', '');
    return await sqlUtils.connectMySQL(SQLUser, SQLpassword, databaseName);
}

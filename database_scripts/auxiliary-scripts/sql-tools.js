/**

 * 
 * @author Paul Lane
 * @since 01.10.2018
 */

const utilities = require('./utilities.js');
const sqltools = require('./sql-tools.js');
const mysql = require('mysql');

// SQL GENERATION
module.exports.generateTableCreateStatement = generateTableCreateStatement;
module.exports.generatePrimaryKeyStatment = generatePrimaryKeyStatment;
module.exports.generateForeignKeyStatements = generateForeignKeyStatements;
module.exports.generateAutoIncrementStatement = generateAutoIncrementStatement;
module.exports.generateDropStatement = generateDropStatement;

// SQL UTILITIES
module.exports.promiseQuery = promiseQuery;
module.exports.logHumanReadableError = logHumanReadableError;
module.exports.initMySQL = initMySQL;
module.exports.executeQueriesSequential = executeQueriesSequential;
module.exports.promiseConnect = promiseConnect;


// TODO: Make json keys constants
const defaultEngine = 'InnoDB';
const defaultCharset = 'utf8';
const numericTypeIdentifiers = ['smallint', 'integer', 'int', 'bigint', 
                                'numeric', 'decimal', 'float', 'real', 
                                'double'];

/**
 * Return a filled templated strings representing the sql statement needed to
 * create a table
 * 
 * @param {string} tableName - The desired name of the table in the database
 * @param {string} columns - A string containing all the column specifications
 * @param {string} engine  - The database engine to use
 * @param {string} charset - The charset to use
 */
function getCreateTableStatement(tableName, columns, engine, charset) {
    return `CREATE TABLE ${tableName} (\n` +
           `${columns}) ENGINE=${engine} CHARSET=${charset};`;
}

function getPrimaryKeyStatement(tableName, columnName) {
    return `ALTER TABLE ${tableName} ADD PRIMARY KEY(${columnName});`
}

function getForeignKeyStatement(tableName, columnName, referenceTable, referenceColumn) {
    return `ALTER TABLE ${tableName} ADD FOREIGN KEY (${columnName}) REFERENCES ` +
           `${referenceTable}(${referenceColumn});`
}

function getAutoIncrementStatement(tableName, columnName, columnType) {
    return `ALTER TABLE ${tableName} MODIFY ${columnName} ${columnType} AUTO_INCREMENT;`;
}

function getDropStatement(tableName) {
    return `DROP TABLE IF EXISTS ${tableName};`;
}

/**
  * Return the sql query to create the table specified with tableJson,
  * including NOT and DEFAULT directives
  * 
  * This function excludes modifiers which are easily added with an ALTER
  * statement
  * 
  * @param tableJson the json object representing the table specification 
  * @returns the sql query to create the table specified with tableJson
  */
function generateTableCreateStatement(tableJson) {
    // Get engine and charset or their defaults
    let engine = utilities.getPropertyIfExists(tableJson, 'engine', defaultEngine);
    let charset = utilities.getPropertyIfExists(tableJson, 'charset', defaultCharset);

    return getCreateTableStatement(tableJson.tableName, 
                                   getColumnsString(tableJson),
                                   engine, charset);
}

function generatePrimaryKeyStatment(tableJson) {
    return getPrimaryKeyStatement(tableJson.tableName, tableJson.primaryKey);
}

function generateForeignKeyStatements(tableJson) {
    let statements = [];
    let foreignKeys = tableJson.foreignKeys;
    let foreignKeysLength = foreignKeys.length;
    for(let i = 0; i < foreignKeysLength; ++i) {
        statements += getForeignKeyStatement(tableJson.tableName,
                                             foreignKeys[i].column,
                                             foreignKeys[i].refTable,
                                             foreignKeys[i].refColumn);
    }

    return statements;
}

function generateAutoIncrementStatement(tableJson) {
    let columnType = getColumnType(tableJson, tableJson.autoIncrement);
    return getAutoIncrementStatement(tableJson.tableName, tableJson.autoIncrement, columnType);
}

function generateDropStatement(tableJson) {
    return getDropStatement(tableJson.tableName);
}

function getColumnType(tableJson, columnName) {
    // TODO: Error checking?
    return tableJson.columns[columnName];
}

function getColumnsString(tableJson) {
    // Get the column strings with types
    let columnStrings = generateTypedColumnStrings(tableJson.columns);

    // Add desired NOT NULL properties
    if (tableJson.hasOwnProperty('notNulls')) {
        columnStrings = generateNotNulledColumnStrings(columnStrings, tableJson.notNulls);
    }

    // Add desired default properties
    if (tableJson.hasOwnProperty('defaults')) {
        columnStrings = generateDefaultColumnStrings(columnStrings, tableJson.defaults);
    }

    // Join the strings into a comma separated list
    return Object.values(columnStrings).join(', \n');
}

/**
 * Return an associative array of column names and their sql table creation
 * string. 
 * Ex: generateCreateQueryColumnStrings({ "id" : "int", "name" : "varchar(255)" }) 
 * returns { "id" : "id varchar(255)", "name" : "name varchar(255)" }
 * 
 * @param {Object.<string, string>} columnsJson - The object specifying column 
 *                                                details
 * @return {Object.<string, string>} The associated column names and their sql 
 *                                   table creation strings
 */
function generateTypedColumnStrings(columnsJson) {
    let columnStrings = {};
    // iterate over columns
    for (let columnName in columnsJson) {
        // Concatenate column name with type
        let columnString = columnName + " " + columnsJson[columnName];
        columnStrings[columnName] = columnString;
    }

    return columnStrings;
}

/**
 * 
 * 
 * @param {Object.<string, string>} columnStrings 
 * @param {string[]} notNullsJson 
 */
function generateNotNulledColumnStrings(columnStrings, notNulls) {
    // Shallow copy columnStrings
    let notNulledStrings = Object.assign({}, columnStrings);

    let notNullsLength = notNulls.length;
    for (let i = 0; i < notNullsLength; ++i) {
        // Check if the column specified is actually a column
        utilities.assertHasOwnProperty(notNulledStrings, notNulls[i],
            `Error: Property 'notNulls' contains the name '${notNulls[i]}' that is not present in 'columns'`);

        notNulledStrings[notNulls[i]] += " NOT NULL";
    }

    return notNulledStrings;
}

function generateDefaultColumnStrings(columnStrings, defaults) {
    let defaultStrings = Object.assign({}, columnStrings);

    //let defaultsLength = defaults.length;
    for (let columnName in defaults) {
        utilities.assertHasOwnProperty(defaultStrings, columnName, 
            `Error: Property 'defaults' contains the name '${columnName}' that is not present in 'columns'`);

        // A little botchy, but if the row contains a numeric type specifier,
        // we don't quote the default literal, otherwise we do
        if(utilities.containsSubstringsCaseInsensitive(defaultStrings[columnName], numericTypeIdentifiers)) {
            defaultStrings[columnName] += ` DEFAULT ${defaults[columnName]}`;
        } else {
            defaultStrings[columnName] += ` DEFAULT '${defaults[columnName]}'`;
        }
    }

    return defaultStrings;
}

function promiseQuery(connection, statement) {
    return new Promise( (resolve, reject) => {
        connection.query(statement, (err, result, fields) => {
            if (err) {
                console.error(`Query failed: `);
                logHumanReadableError(err);
                console.error('For statement: ');
                console.error(statement);
                connection.query('ROLLBACK;');
                connection.end((err) => {
                    console.log('Disconnected from database...');
                });
                process.exit(1);
            } else if (result) {
                console.log('Query successful: ');
                console.log(statement);
            } else if (fields) {
                console.log(fields);
            }
            console.log('');
            resolve(result, fields);
        })
    });
}

function promiseConnect(connection) {
    return new Promise((resolve, reject) => connection.connect((err) => {
        if (err) {
            console.error('Failed to connect to MySQL\n');
            console.error(err);
        }
        console.log('Connected to SQL database...\n');
        resolve();
    }));
}

function logHumanReadableError(err) {
    console.error(`SQL Error ${err.errno}: ${err.code}`);
    console.error(`Message: ${err.sqlMessage}`);
}

function initMySQL(userName, password) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: userName,
        password: password,
        database: 'soen343'
    });

    return connection;
}

// function executeQueriesSequential(backbonePromise, connection, queries) {
//     // return new Promise((resolve, reject) => {
//         let queriesLength = queries.length;
//         for(let i = 0; i < queriesLength; ++i) {
//             backbonePromise = backbonePromise.then(() => sqltools.promiseQuery(connection, queries[i]));
//         }
//         //resolve();
//     //});
    
    
    
//     // return new Promise((resolve, reject) => {
//     //     // This chaining code forces Node.js to run the queries sequentially
//     //     // Inspired by this solution:
//     //     // https://stackoverflow.com/questions/44955463/creating-a-promise-chain-in-a-for-loop
//     //     let chain = Promise.resolve();
//     //     let queriesLength = queries.length;
//     //     for(let i = 0; i < queriesLength; ++i) {
//     //         chain = chain.then(() => sqltools.promiseQuery(connection, queries[i]));
//     //     }
//     //     resolve();


//     // });


// }

function generateAllTableDropStatements(connection) {
    let queries = [];
    connection.query(`SELECT concat('DROP TABLE IF EXISTS ', table_name, ';')
    FROM information_schema.tables
    WHERE table_schema = 'MyDatabaseName';`, (err, result, fields) => {
        console.log(result);
    });
}

function executeQueriesSequential(inputChain, connection, queries) {
    let queriesLength = queries.length;
    for(let i = 0 ; i < queriesLength; ++i) {
        inputChain = inputChain.then(() => promiseQuery(connection, queries[i]));
    }
    return inputChain;
}

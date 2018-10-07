/**
 * Functions that generate SQL queries.
 * 
 * @author Paul Lane
 * @since 01.10.2018
 */

const utilities = require('./utilities.js');
const sqlUtils = require('./sql-utilities.js');

module.exports.generateTableCreateStatement = generateTableCreateStatement;
module.exports.generatePrimaryKeyStatment = generatePrimaryKeyStatment;
module.exports.generateForeignKeyStatements = generateForeignKeyStatements;
module.exports.generateAutoIncrementStatement = generateAutoIncrementStatement;
module.exports.generateAllTableDropStatements = generateAllTableDropStatements;

// TODO: Make json keys constants
const defaultEngine = 'InnoDB';
const defaultCharset = 'utf8';
const numericTypeIdentifiers = ['smallint', 'integer', 'int', 'bigint', 
                                'numeric', 'decimal', 'float', 'real', 
                                'double'];

/**
 * Return a string representing the sql create table statment.
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

/**
 * Return a string representing the sql query to add a primary key to a table.
 * 
 * @param {string} tableName - Table to add the primary key to
 * @param {string} columnName - Column to make the primary key
 */
function getPrimaryKeyStatement(tableName, columnName) {
    return `ALTER TABLE ${tableName} ADD PRIMARY KEY(${columnName});`
}

/**
 * Return a string representing the sql query to create a foreign key relation.
 * 
 * @param {string} tableName - The table to contain the foreign key
 * @param {string} columnName - The column to become the foreign key
 * @param {string} referenceTable - The table this foreign key will reference
 * @param {string} referenceColumn - The column the foreign key will reference
 */
function getForeignKeyStatement(tableName, columnName, referenceTable, referenceColumn) {
    return `ALTER TABLE ${tableName} ADD FOREIGN KEY (${columnName}) REFERENCES ` +
           `${referenceTable}(${referenceColumn});`
}

/**
 * Return a string representing the sql query to make a column auto increment.
 * 
 * @param {string} tableName - The table to contain the auto increment column
 * @param {string} columnName - The column the be auto incremented
 * @param {string} columnType - The data type of the column
 */
function getAutoIncrementStatement(tableName, columnName, columnType) {
    return `ALTER TABLE ${tableName} MODIFY ${columnName} ${columnType} AUTO_INCREMENT;`;
}

/**
 * Return a string representing the sql query to drop a table.
 * 
 * @param {string} tableName - Table to drop
 */
function getDropStatement(tableName) {
    return `DROP TABLE IF EXISTS ${tableName};`;
}

/**
 * Return a string representing the sql query to get drop table statements for
 * all tables in the supplied database.
 * 
 * @param {string} databaseName - Database in which to drop all tables
 */
function getAllTablesDropStatment(databaseName) {
    return `SELECT concat('DROP TABLE IF EXISTS ', table_name, ';') ` + 
           `FROM information_schema.tables ` +
           `WHERE table_schema = '${databaseName}';`;
}

/**
  * Return the sql query to create the table specified with tableJson,
  * including NOT NULL and DEFAULT directives
  * 
  * This function excludes modifiers which are easily added with an ALTER
  * statement
  * 
  * @param {*} tableJson - the json object representing the table specification 
  */
function generateTableCreateStatement(tableJson) {
    // Get engine and charset or their defaults
    let engine = utilities.getPropertyIfExists(tableJson, 'engine', defaultEngine);
    let charset = utilities.getPropertyIfExists(tableJson, 'charset', defaultCharset);

    return getCreateTableStatement(tableJson.tableName, 
                                   getColumnsString(tableJson),
                                   engine, charset);
}

/**
 * Return the sql query to alter the table to create a primary key
 * 
 * @param {*} tableJson - JSON table object
 */
function generatePrimaryKeyStatment(tableJson) {
    return getPrimaryKeyStatement(tableJson.tableName, tableJson.primaryKey);
}

/**
 * Return the sql query to alter the supplied table to have a foreign key 
 * relation
 * 
 * @param {*} tableJson - JSON table object
 */
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

/**
 * Return the sql query to alter the supplied table to have an auto increment
 * column
 * 
 * @param {*} tableJson - JSON table object
 */
function generateAutoIncrementStatement(tableJson) {
    let columnType = getColumnType(tableJson, tableJson.autoIncrement);
    return getAutoIncrementStatement(tableJson.tableName, tableJson.autoIncrement, columnType);
}

/**
 * Return the sql query to drop the supplied table
 * 
 * @param {*} tableJson - JSON table object
 */
function generateDropStatement(tableJson) {
    return getDropStatement(tableJson.tableName);
}

/**
 * Return an array of sql drop statements to remove every table from the 
 * supplied database
 * 
 * @param {mysql.Connection} connection 
 * @param {string} databaseName 
 */
async function generateAllTableDropStatements(connection, databaseName) {
    let rawResults = await sqlUtils.query(connection, getAllTablesDropStatment(databaseName));
    return sqlUtils.extractResultValues(rawResults);
}

/**
 * Return the data type of the column
 * 
 * @param {*} tableJson - JSON table object
 * @param {string} columnName - Column to retrieve data type for
 */
function getColumnType(tableJson, columnName) {
    // TODO: Error checking?
    return tableJson.columns[columnName];
}

/**
 * Returns a string that represents all the columns for the supplied table's
 * create statement, including NOT NULL and DEFAULT directives.
 * 
 * @param {*} tableJson - JSON table object
 */
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
 *                                                types
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
 * Returns a copy of the columnStrings object but whose create statement 
 * strings are appended with the NOT NULL directive if their column name
 * appears in the notNulls array.
 * 
 * @param {Object.<string, string>} columnStrings 
 * @param {string[]} notNulls
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

/**
 * Returns a copy of the columnStrings object but whose create statement 
 * strings are appended with the DEFAULT directive if their column name
 * appears in the defaults object. The value will be quoted if it is a string
 * like data type and won't be otherwise.
 * 
 * @param {Object.<string, string>} columnStrings 
 * @param {string[]} defaults
 */
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

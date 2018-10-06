const utilities = require('./utilities.js');
const sqltools = require('./sql-tools.js');

module.exports.createTables = createTables;
module.exports.dropTables = dropTables;
module.exports.refreshTables = refreshTables;

function createTables(tables) {
    return new Promise((resolve, reject) => {
        // Authenticate sql
        let SQLUser = utilities.getPropertyIfExists(process.env, 'SQLUser', 'root');
        let SQLpassword = utilities.getPropertyIfExists(process.env, 'SQLPassword', '');
        const connection = sqltools.initMySQL(SQLUser, SQLpassword);

        let queries = [];
        queries.push('SET AUTOCOMMIT = 0;');
        queries.push('START TRANSACTION;');
        queries = queries.concat(prepareCreateQueries(tables));
        queries.push('COMMIT;');

        console.log(queries);

        let chain = Promise.resolve();
        chain = chain.then(() => sqltools.promiseConnect(connection));
        let queriesLength = queries.length;
        for(let i = 0; i < queriesLength; ++i) {
            chain = chain.then(() => sqltools.promiseQuery(connection, queries[i]));
        }
        chain = chain.then(() => connection.end(function(err) {
            if (err) {
                console.log('Failed to disconnect from SQL database...\n');
            }
            console.log('Disconnected from SQL database...\n');
        }));
        resolve();
    })
}

function promiseDisconnect(connection) {
    return new Promise((resolve, reject) => {
        connection.end(function(err) {
            if (err) {
                console.log('Failed to disconnect from SQL database...\n');
            }
            console.log('Disconnected from SQL database...\n');
        });
    });
}

function dropTables(tables) {
    return new Promise((resolve, reject) => {
        // Authenticate sql
        let SQLUser = utilities.getPropertyIfExists(process.env, 'SQLUser', 'root');
        let SQLpassword = utilities.getPropertyIfExists(process.env, 'SQLPassword', '');
        const connection = sqltools.initMySQL(SQLUser, SQLpassword);

        let queries = [];
        queries.push('SET FOREIGN_KEY_CHECKS = 0;');
        queries = queries.concat(prepareDropQueries(tables));
        queries.push('SET FOREIGN_KEY_CHECKS = 1;');

        let chain = Promise.resolve();
        chain = chain.then(() => sqltools.promiseConnect(connection));
        let queriesLength = queries.length;
        for(let i = 0; i < queriesLength; ++i) {
            chain = chain.then(() => sqltools.promiseQuery(connection, queries[i]));
        }
        chain = chain.then(() => connection.end(function(err) {
            if (err) {
                console.log('Failed to disconnect from SQL database...\n');
            }
            console.log('Disconnected from SQL database...\n');
        }));
        resolve();
    });
}

function refreshTables(tables) {
        // Authenticate sql
        let SQLUser = utilities.getPropertyIfExists(process.env, 'SQLUser', 'root');
        let SQLpassword = utilities.getPropertyIfExists(process.env, 'SQLPassword', '');
        const connection = sqltools.initMySQL(SQLUser, SQLpassword);
}

function prepareCreateQueries(tables) {
    let queries = [];
    // Enqueue table create and primary key queries
    let tablesLength = tables.length;
    for(let i = 0; i < tablesLength; ++i) {
        console.log(`Generating queries for table '${tables[i].tableName}'`);
        queries.push(sqltools.generateTableCreateStatement(tables[i]));
        queries.push(sqltools.generatePrimaryKeyStatment(tables[i]));
        if(tables[i].hasOwnProperty('autoIncrement')) {
            queries.push(sqltools.generateAutoIncrementStatement(tables[i]));
        }
    }

    // Then once all tables are created, enqueue foreign key queries
    for(let i = 0; i < tablesLength; ++i) {
        if(tables[i].hasOwnProperty('foreignKeys')) {
            queries = queries.concat(sqltools.generateForeignKeyStatements(tables[i]));
        }
    }


    console.log(queries);
    return queries;
}

function prepareDropQueries(tables) {
    let queries = [];

    let tablesLength = tables.length;
    for(let i = 0; i < tablesLength; ++i) {
        console.log(`Generating queries for table '${tables[i].tableName}'`);
        queries.push(sqltools.generateDropStatement(tables[i]));
    }

    return queries;
}


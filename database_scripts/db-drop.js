const dbCommands = require('./auxiliary-scripts/db-commands.js');

dropAll();

function dropAll() {
    dbCommands.dropAllTables('soen343');
}

const utilities = require('./auxiliary-scripts/utilities.js');
const dbCommands = require('./auxiliary-scripts/db-commands.js');

main();

function main() {
    let tableDirectory = process.argv.slice(2)[0]; // Take the first cli argument only
    let tables = utilities.getJsonFilesFromDirectory(tableDirectory + '/');
    dbCommands.dropTables(tables);
}

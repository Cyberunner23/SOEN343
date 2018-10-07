/**
 * Deletes all the tables in the soen343 database then creates the tables
 * defined in the supplied directory
 * 
 * Example invokation: node db-refresh.js ./tables
 *
 * @arg arg1 - The relative directory of the tables to create after dropping
 *             all tables in the database 
 * 
 * @author Paul Lane
 * @since 7.10.2018
 */

const dbCommands = require('./auxiliary-scripts/db-commands');
const utilities = require('./auxiliary-scripts/utilities.js');

refresh(); // Entrypoint

async function refresh() {
    // Get the tables as JSON
    let tableDirectory = process.argv.slice(2)[0]; // Take the first cli argument only
    let tables = utilities.getJsonFilesFromDirectory(tableDirectory + '/');
    
    await dbCommands.dropAllTables('soen343');
    await dbCommands.createTables('soen343', tables);
}
/** 
 * Creates all the tables specified in the supplied directory.
 * 
 * Example invokation: node db-create.js ./tables
 * 
 * @argument arg1 - The relative directory of the tables to create after 
 *                  dropping all tables in the database 
 * 
 * @author Paul Lane
 * @since 01.10.2018
 */

const dbCommands = require('./auxiliary-scripts/db-commands');
const utilities = require('./auxiliary-scripts/utilities.js');

main(); // Entrypoint

function main() {
    let tableDirectory = process.argv.slice(2)[0]; // Take the first cli argument only
    let tables = utilities.getJsonFilesFromDirectory(tableDirectory + '/');

    dbCommands.createTables('soen343', tables);
}

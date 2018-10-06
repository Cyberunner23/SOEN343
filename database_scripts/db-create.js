/**
 * Create all tables specified in the supplied directory
 * 
 * Scans the directory path supplied as the first command line argument for 
 * json files which contain a table specification. All found table
 * specifications are then created under the current database.
 * Table Spec: <> = optional
 * {
 *    <'engine': 'InnoDB',>
 *    <'charset': 'utf8',>
 *    <'collation': 'utf8_unicode_ci',>
 * 
 *    'tableName': 'guests',
 *    'columns': [
 *       {'id': 'int(11)', 'notNull': flase},
 *       'name': 'varchar(255)',
 *       'favorite_colour': 'varchar(255)',
 *       ''
 *    ]
 *    
 *    'primaryKey': 'id',
 *    
 *    <'notNulls': ['id', 'favorite_color'],>
 *    <'foreignKeys': [
 *        {'column': 'name', 'ref_table': 'a_different_table', 'ref_column': 'client_name'}
 *     ]>
 * }
 * 
 * @argument arg1 directory to search for table specifications
 * @author Paul Lane
 * @since 01.10.2018
 */

const dbCommands = require('./auxiliary-scripts/db-commands');
const utilities = require('./auxiliary-scripts/utilities.js');

main(); // Entrypoint

function main() {
    let tableDirectory = process.argv.slice(2)[0]; // Take the first cli argument only
    let tables = utilities.getJsonFilesFromDirectory(tableDirectory + '/');
    dbCommands.createTables(tables);
}

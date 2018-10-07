/**
 * A set of functions that perform generic operations.
 * 
 * @author Paul Lane
 * @since 01.10.2018
 */

const fs = require('fs');

module.exports.getPropertyIfExists = getPropertyIfExists;
module.exports.assertHasOwnProperty = assertHasOwnProperty;
module.exports.containsSubstringsCaseInsensitive = containsSubstringsCaseInsensitive;
module.exports.getJsonFilesFromDirectory = getJsonFilesFromDirectory;

/**
 * Return the value of obj.property if it exists, the defaultValue otherwise.
 * 
 * @param {Object} obj - An object
 * @param {string} property - The property name to check for in obj
 * @param {any} defaultValue - Value to return if the property is not present
 */
function getPropertyIfExists(obj, property, defaultValue) {
    if (obj.hasOwnProperty(property)) {
        return obj[property];
    } else {
        return defaultValue;
    }
}

/**
 * Check if the object has the supplied property name. If it doesn't print the
 * supplied message to stderr and terminate the process with an error code.
 * 
 * @param {*} obj - The object to check for the property
 * @param {string} property - The name of the property to check for
 * @param {string} message - The message to log if the object doesn't have the 
 *                           property
 */
function assertHasOwnProperty(obj, property, message) {
    if (!obj.hasOwnProperty(property)) {
        console.error(message);
        process.exit(1);
    }
}

/**
 * Return whether the string contains any of the supplied substrings.
 * 
 * @param {string} string - String to search
 * @param {string[]} substrings - List of substrings to check for
 */
function containsSubstringsCaseInsensitive(string, substrings) {
    let substringsLength = substrings.length;
    for(let i = 0; i < substringsLength; ++i) {
        if(string.toLowerCase().indexOf(substrings[i].toLowerCase()) != -1) {
            return true;
        }
    }
    return false;
}

/**
 * Return all json files in the directory as objects.
 * 
 * Note: Finds and parses all files in the directory with the extension '.json'
 * 
 * @param {string} directoryPath - The relative or absolute path to a directory
 */
function getJsonFilesFromDirectory(directoryPath) {
    // Read all directory entries
    let directoryContents = fs.readdirSync(directoryPath);

    // Remove entries that don't have the json extension
    let jsonFilePaths = directoryContents.filter((fileString) => {
        return fileString.toLowerCase().indexOf('.json') != -1;
    });

    // Parse the json into objects added to an array
    let jsonContents = [];
    let jsonFilePathsLength = jsonFilePaths.length;
    for(let i = 0; i < jsonFilePathsLength; ++i) {
        console.log(`Parsing json from ${directoryPath  + jsonFilePaths[i]}`);
        let fileContents = fs.readFileSync(directoryPath + jsonFilePaths[i])
        jsonContents.push(JSON.parse(fileContents));
    }

    return jsonContents;
}

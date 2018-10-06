const fs = require('fs');

/**
 * Return the value of obj.property if it exists, the defaultValue otherwise
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

function assertHasOwnProperty(obj, property, message) {
    if (!obj.hasOwnProperty(property)) {
        console.error(message);
        process.exit(1);
    }
}

function containsSubstringsCaseInsensitive(string, substrings) {
    let substringsLength = substrings.length;
    for(let i = 0; i < substringsLength; ++i) {
        if(string.toLowerCase().indexOf(substrings[i].toLowerCase()) != -1) {
            return true;
        }
    }
    return false;
}

function getJsonFilesFromDirectory(directoryPath) {
    let directoryContents = fs.readdirSync(directoryPath);
    let jsonFilePaths = directoryContents.filter((fileString) => {
        return fileString.toLowerCase().indexOf('.json') != -1;
    });

    let jsonContents = [];
    let jsonFilePathsLength = jsonFilePaths.length;
    for(let i = 0; i < jsonFilePathsLength; ++i) {
        console.log(`Parsing json from ${directoryPath  + jsonFilePaths[i]}`);
        let fileContents = fs.readFileSync(directoryPath + jsonFilePaths[i])
        jsonContents.push(JSON.parse(fileContents));
    }

    return jsonContents;
}

module.exports.getPropertyIfExists = getPropertyIfExists;
module.exports.assertHasOwnProperty = assertHasOwnProperty;
module.exports.containsSubstringsCaseInsensitive = containsSubstringsCaseInsensitive;
module.exports.getJsonFilesFromDirectory = getJsonFilesFromDirectory;

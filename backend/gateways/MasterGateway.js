const db = require('../DatabaseConnection').getInstance();
const Exceptions = require('../Exceptions').Exceptions;
const SqlString = require('SqlString');

class MasterGateway {

    constructor () {
        this.stateChangingQueries = null; // this should be null later
    }

    createTransaction() {
        this.stateChangingQueries = [];
    }

    async executeTransaction() {
        return new Promise(async (resolve, reject) => {
            if (this.stateChangingQueries === null) {
                reject(Exceptions.PreconditionsNotMet);
                return;
            }
            if (this.stateChangingQueries.length !== 0) {
                var queries = this.stateChangingQueries.join("; ") + ";";
                console.log('MasterGateway: ' + queries);
                await db.query(queries, (err, result) => {
                    if (!err) {
                        resolve();
                    }
                    else {
                        console.log(err);
                        reject(Exceptions.InternalServerError);
                    }
                })
            }
            this.stateChangingQueries = null; // this should be null later
        })
    }

    async get (tableName, jsonFilters) {
        return new Promise((resolve, reject) => {
    
            var query = "SELECT * FROM " + tableName;
    
            if (jsonFilters !== undefined) {
                var pairs = [];
                for (var filter in jsonFilters) {
                    pairs.push(filter + " LIKE " + SqlString.escape("%" + jsonFilters[filter] + "%"));
                }
                query += " WHERE " + pairs.join(" AND ");
            }
    
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(result);
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
    
    add (tableName, record) {
        var fields = [];
        var values = [];
        for (var field in record) {
            fields.push(field);
            values.push(SqlString.escape(record[field]));
        }
        var query = "INSERT INTO " + tableName + " (" + fields + ") VALUES(" + values + ")";

        this.stateChangingQueries.push(query);
    }
    
    update (tableName, record, identifier) {
        var pairs = [];
        for (var field in record) {
            pairs.push(field + "=" + SqlString.escape(record[field]));
        }

        var query = "UPDATE " + tableName + " SET " + pairs + " WHERE " + identifier + "=" + SqlString.escape(record[identifier]);

        this.stateChangingQueries.push(query);
    }
    
    delete (tableName, identifierName, identifierValue) {
        var query = "DELETE FROM " + tableName;
        if (identifierName !== undefined && identifierValue !== undefined) {
            query += " WHERE " + identifierName + "=" + SqlString.escape(identifierValue);
        }
    
        this.stateChangingQueries.push(query);
    }
}

const instance = new MasterGateway();
exports.getInstance = () => {
    return instance;
}
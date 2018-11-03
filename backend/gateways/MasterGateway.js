
const db = require('../DatabaseConnection').getInstance();
const Exceptions = require('../Exceptions').Exceptions;

class MasterGateway {

    async get (tableName, jsonFilters) {
        return new Promise((resolve, reject) => {
    
            var query = "SELECT * FROM " + tableName;
    
            if (jsonFilters !== undefined) {
                var pairs = [];
                for (var filter in jsonFilters) {
                    pairs.push(filter + " LIKE '%" + jsonFilters[filter] + "%'");
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
    
    async add (tableName, record) {
        return new Promise((resolve, reject) => {
            var fields = [];
            var values = [];
            for (var field in record) {
                fields.push(field);
                values.push("'" + record[field] + "'");
            }
            query = "INSERT INTO " + tableName + " (" + fields + ") VALUES(" + values + ")";
    
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    resolve ();
                }
            });
        })
    }
    
    async update (tableName, record, identifier) {
        return new Promise((resolve, reject) => {
    
            var pairs = [];
            for (field in record) {
                pairs.push(field + "='" + record[field] + "'");
            }
    
            var query = "UPDATE " + tableName + " SET " + pairs + " WHERE " + identifier + "='" + record[identifier] + "'";
    
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
                else {
                    resolve();
                }
            })
        })
    }
    
    async delete (tableName, identifier, identifiersToDelete) {
        return new Promise((resolve, reject) => {
            var query = "DELETE FROM " + tableName;
            if (identifier !== undefined && identifiersToDelete !== undefined) {
                query += " WHERE " + identifier + " IN (" + identifiersToDelete + ")";
            }
        
            db.query(query, (err, result) => {
                if (!err) {
                    resolve();
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
}

const instance = new MasterGateway();
exports.getInstance = () => {
    return instance;
}
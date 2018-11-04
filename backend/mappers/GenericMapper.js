const GenericUnitOfWork = require('../unitsOfWork/GenericUnitOfWork').GenericUnitOfWork;
const OperationType = require('../unitsOfWork/GenericUnitOfWork').OperationType;
const Exceptions = require('../Exceptions').Exceptions;

exports.GenericMapper = class GenericMapper {

    constructor () {
        this.identifier = 'identifier';
        this.identityMap = null;
        this.gateway = null;
        this.unitOfWork = new GenericUnitOfWork();
    }

    sendChangesToGateway() {
        var identities = this.identityMap.get();
        this.identityMap.clear();

        var operations = this.unitOfWork.get();
        this.unitOfWork.clear();

        operations.forEach(operation => {
            var operationType = operation.operationType;
            var identifier = operation.identifier;
            if (operationType === OperationType.Delete) {
                this.gateway.delete(identifier);
            }
            else {
                var record = identities.find(record => {
                    return record[this.identifier] === identifier;
                })
                console.log('record: ' + JSON.stringify(record));
                if (operationType === OperationType.Add) {
                    this.gateway.add(record);
                }
                else if (operationType === OperationType.Update) {
                    this.gateway.update(record);
                }
            }
        })
    }

    async get(callback) {
        if (callback === undefined) {
            callback = record => {return true}; // get all records;
        }
        return new Promise(async (resolve, reject) => {
            var identities = this.identityMap.get(callback);
            var operations = this.unitOfWork.get();
            this.gateway.get()
            .then(databaseEntries => {

                databaseEntries = databaseEntries.filter(callback);

                var operationIdentifiers = [];
                operations.forEach(operation => {
                    operationIdentifiers.push(operation.identifier);
                })
        
                databaseEntries = databaseEntries.filter(entry => {
                    return !operationIdentifiers.includes(entry[this.identifier]);
                })

                resolve(identities.concat(databaseEntries));
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async add(record) {
        return new Promise((resolve, reject) => {

            var identifier = this.identifier;
            this.get(rec => {
                return rec[identifier] === record[identifier];
            })
            .then(records => {
                if (records.length === 0) {
                    this.identityMap.add(record);
                    this.unitOfWork.add(record[identifier]);
                    resolve(record);
                }
                else {
                    reject(Exceptions.BadRequest);
                }
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async remove(callback) {
        new Promise((resolve, reject) => {

            if (callback === undefined) {
                callback = record => {return true}; // select all records
            }

            this.get(callback)
            .then(recordsToRemove => {
                var identifiersToRemove = [];
                recordsToRemove.forEach(record => {
                    identifiersToRemove.push(record[this.identifier]);
                })
                this.identityMap.remove(identifiersToRemove);
                identifiersToRemove.forEach(identifier => {
                    this.unitOfWork.delete(identifier);
                })
                resolve(recordsToRemove);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modify(modifyProperties, callback) {
        console.log('mapper.modify');
        return new Promise(async (resolve, reject) => {
            this.get(callback)
            .then(recordsToModify => {
                var arrayOfModifiedRecords = this.modifyHelper(recordsToModify, modifyProperties);
                arrayOfModifiedRecords.forEach(record => {
                    this.unitOfWork.update(record[this.identifier]);
                    var matchingIdentities = this.identityMap.get(identity => {
                        return identity[this.identifier] === record[this.identifier];
                    });
                    if (matchingIdentities.length === 0) {
                        this.identityMap.add(record);
                    }
                    else {
                        this.identifier.update(record);
                    }
                })
                resolve(arrayOfModifiedRecords);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    /**
     * Modify records in toModify with the supplied modifyProperties.
     * Return the modified records.
     * 
     * @param {any[]} toModify - The array of records to modify
     * @param {JSON} modifyProperties - Collection of named properties and their values
     */
    modifyHelper(toModify, modifyProperties) {
            toModify.forEach(item => {
                for (let property in modifyProperties) {
                    item[property] = modifyProperties[property];
                }
            });
            return toModify;
    }
}
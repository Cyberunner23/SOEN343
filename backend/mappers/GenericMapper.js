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
                    var identifier = record[this.identifier];
                    var previousOperations = this.unitOfWork.get().filter(operation => {return operation.identifier === identifier});
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.identityMap.add(record);
                        this.unitOfWork.add(identifier);
                    }
                    else {
                        // size should be 1
                        var previousOperation = previousOperations[0];
                        if (previousOperation.operationType === OperationType.Delete) {
                            this.identityMap.add(record);
                            this.unitOfWork.update(record[this.identifier]);
                        }
                        else {
                            console.log('GenericMapper: In this context, if a previous operation exists, it must be a delete.');
                            reject(Exceptions.InternalServerError);
                            return;
                        }
                    }
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
            this.get(callback)
            .then(recordsToRemove => {
                recordsToRemove.forEach(record => {
                    var identifier = record[this.identifier];
                    var previousOperations = this.unitOfWork.get().filter(operation => {return operation.identifier === identifier});
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.unitOfWork.delete(identifier);
                    }
                    else {
                        // size should be 1
                        var previousOperation = previousOperations[0];
                        if (previousOperation.operationType === OperationType.Add) {
                            this.identityMap.remove([identifier]);
                            this.unitOfWork.markClean(identifier);
                        }
                        else if (previousOperation.operationType === OperationType.Update) {
                            this.identityMap.remove([identifier]);
                            this.unitOfWork.delete(identifier);
                        }
                        else if (previousOperation.operationType === OperationType.Delete) {
                            console.log('Mapper: cannot double delete!');
                            throw Exceptions.InternalServerError;
                        }
                    }
                })
                resolve(recordsToRemove);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modify(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {
            this.get(callback)
            .then(recordsToModify => {
                var arrayOfModifiedRecords = [];
                recordsToModify.forEach(record => {
                    var identifier = record[this.identifier];
                    var previousOperations = this.unitOfWork.get(operation => {return operation.identifer === identifier});
                    this.modifyHelper(record, modifyProperties);
                    arrayOfModifiedRecords.push(record);
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.identityMap.add(record);
                        this.unitOfWork.update(identifier);
                    }
                    else {
                        // size should be 1
                        var previousOperation = previousOperations[0];
                        if (previousOperation.operationType === OperationType.Add) {
                            this.identityMap.update(record);
                        }
                        else if (previousOperation.operationType === OperationType.Update) {
                            this.identityMap.update(record);
                        }
                        else if (previousOperation.operationType === OperationType.Delete) {
                            this.identityMap.add(record);
                            this.unitOfWork.update(identifier);
                        }
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
     * Modify the record with the supplied modifyProperties.
     * 
     * @param {any} record - The record to modify
     * @param {JSON} modifyProperties - Collection of named properties and their values
     */
    modifyHelper(record, modifyProperties) {
        for (let property in modifyProperties) {
            record[property] = modifyProperties[property];
        }
    }
}
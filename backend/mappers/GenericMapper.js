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

    async get(filters) {
        return new Promise(async (resolve, reject) => {
            var identities = this.identityMap.get(record => {
                return filter(record, filters);
            });
            var operations = this.unitOfWork.get();
            this.gateway.get(filters)
            .then(databaseEntries => {

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
            var filters = {};
            filters[this.identifier] = record[this.identifier];
            this.get(filters)
            .then(records => {
                if (records.length === 0) {
                    var identifierValue = record[this.identifier];
                    var previousOperations = this.unitOfWork.get(operation => {
                        return operation.identifier === identifierValue
                    });
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.identityMap.add(record);
                        this.unitOfWork.add(identifierValue);
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

    async remove(filters) {
        return new Promise((resolve, reject) => {
            this.get(filters)
            .then(recordsToRemove => {
                recordsToRemove.forEach(record => {
                    var identifierValue = record[this.identifier];
                    var previousOperations = this.unitOfWork.get(operation => {
                        return operation.identifier === identifierValue
                    });
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.unitOfWork.delete(identifierValue);
                    }
                    else {
                        // size should be 1
                        var previousOperation = previousOperations[0];
                        if (previousOperation.operationType === OperationType.Add) {
                            this.identityMap.remove(identifierValue);
                            this.unitOfWork.markClean(identifierValue);
                        }
                        else if (previousOperation.operationType === OperationType.Update) {
                            this.identityMap.remove(identifierValue);
                            this.unitOfWork.delete(identifierValue);
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

    async modify(filters, modifyProperties) {
        return new Promise(async (resolve, reject) => {
            this.get(filters)
            .then(recordsToModify => {
                var arrayOfModifiedRecords = [];
                recordsToModify.forEach(record => {
                    var identifierValue = record[this.identifier];
                    var previousOperations = this.unitOfWork.get(operation => {
                        return operation.identifier === identifierValue
                    });
                    this.modifyHelper(record, modifyProperties);
                    arrayOfModifiedRecords.push(record);
                    // Unit of work guarantees that size is either 0 or 1
                    if (previousOperations.length === 0) {
                        this.identityMap.add(record);
                        this.unitOfWork.update(identifierValue);
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
                            console.log('Cannot update a previously deleted record');
                            throw Exceptions.InternalServerError;
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

filter = (record, filters) => {
    var toReturn = true;
    for(var field in filters){
        toReturn = toReturn && record[field].toString().toLowerCase().includes(filters[field].toString().toLowerCase());
    }
    return toReturn;
}
const GenericUnitOfWork = require('../unitsOfWork/GenericUnitOfWork').GenericUnitOfWork;
const OperationType = require('../unitsOfWork/GenericUnitOfWork').OperationType;
const Exceptions = require('../Exceptions').Exceptions;
const ReadWriteLock = require('rwlock')

var lock = new ReadWriteLock();

exports.GenericMapper = class GenericMapper {

    constructor() {
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
        var mapper = this;
        var promise;
        await lock.async.readLock(async function (error, release) 
        {
            promise = mapper.privateGet(filters);
            release();
        });

        return promise;
    }

    async privateGet(filters) {
        if (filters === undefined) {
            filters = {};
        }
        var mapper = this;
        return new Promise(async (resolve, reject) => {
            var identities = mapper.identityMap.get(record => {
                return filter(record, filters);
            });
            var operations = mapper.unitOfWork.get();
            mapper.gateway.get(filters)
                .then(databaseEntries => {

                    var operationIdentifiers = [];
                    operations.forEach(operation => {
                        operationIdentifiers.push(operation.identifier);
                    })

                    databaseEntries = databaseEntries.filter(entry => {
                        return !operationIdentifiers.includes(entry[mapper.identifier]);
                    })

                    resolve(identities.concat(databaseEntries));
                })
                .catch(exception => {
                    reject(exception);
                })

        })
    }

    async add(record) {
        var mapper = this;
        var promise;
        await lock.async.writeLock(async function (error, release) {
            promise = new Promise((resolve, reject) => {
                var filters = {};
                filters[mapper.identifier] = record[mapper.identifier];
                mapper.privateGet(filters)
                    .then(records => {
                        if (records.length === 0) {
                            var identifierValue = record[mapper.identifier];
                            var previousOperations = mapper.unitOfWork.get(operation => {
                                return operation.identifier === identifierValue
                            });
                            // Unit of work guarantees that size is either 0 or 1
                            if (previousOperations.length === 0) {
                                mapper.identityMap.add(record);
                                mapper.unitOfWork.add(identifierValue);
                            }
                            else {
                                // size should be 1
                                var previousOperation = previousOperations[0];
                                if (previousOperation.operationType === OperationType.Delete) {
                                    mapper.identityMap.add(record);
                                    mapper.unitOfWork.update(record[mapper.identifier]);
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
            release();
        })
        return promise;
    }

    async remove(filters) {
        var mapper = this;
        var promise;
        await lock.async.writeLock(async function (error, release) {
            promise = new Promise((resolve, reject) => {
                mapper.privateGet(filters)
                    .then(recordsToRemove => {
                        recordsToRemove.forEach(record => {
                            var identifierValue = record[mapper.identifier];
                            var previousOperations = mapper.unitOfWork.get(operation => {
                                return operation.identifier === identifierValue
                            });
                            // Unit of work guarantees that size is either 0 or 1
                            if (previousOperations.length === 0) {
                                mapper.unitOfWork.delete(identifierValue);
                            }
                            else {
                                // size should be 1
                                var previousOperation = previousOperations[0];
                                if (previousOperation.operationType === OperationType.Add) {
                                    mapper.identityMap.remove(identifierValue);
                                    mapper.unitOfWork.markClean(identifierValue);
                                }
                                else if (previousOperation.operationType === OperationType.Update) {
                                    mapper.identityMap.remove(identifierValue);
                                    mapper.unitOfWork.delete(identifierValue);
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
            release();
        })
        return promise;
    }

    async modify(filters, modifyProperties) {
        var mapper = this;
        var promise;

        await lock.async.writeLock(async function (error, release) {

            promise = new Promise(async (resolve, reject) => {
                this.privateGet(filters)
                    .then(recordsToModify => {
                        var arrayOfModifiedRecords = [];
                        recordsToModify.forEach(record => {
                            var identifierValue = record[mapper.identifier];
                            var previousOperations = mapper.unitOfWork.get(operation => {
                                return operation.identifier === identifierValue
                            });
                            mapper.modifyHelper(record, modifyProperties);
                            arrayOfModifiedRecords.push(record);
                            // Unit of work guarantees that size is either 0 or 1
                            if (previousOperations.length === 0) {
                                mapper.identityMap.add(record);
                                mapper.unitOfWork.update(identifierValue);
                            }
                            else {
                                // size should be 1
                                var previousOperation = previousOperations[0];
                                if (previousOperation.operationType === OperationType.Add) {
                                    mapper.identityMap.update(record);
                                }
                                else if (previousOperation.operationType === OperationType.Update) {
                                    mapper.identityMap.update(record);
                                }
                                else if (previousOperation.operationType === OperationType.Delete) {
                                    mapper.identityMap.add(record);
                                    mapper.unitOfWork.update(identifierValue);
                                }
                            }
                        })
                        resolve(arrayOfModifiedRecords);
                    })
                    .catch(exception => {
                        reject(exception);
                    })
            })
            release();
        })

        return promise;
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
    for (var field in filters) {
        toReturn = toReturn && record[field].toString().toLowerCase().includes(filters[field].toString().toLowerCase());
    }
    return toReturn;
}
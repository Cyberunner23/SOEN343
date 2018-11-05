const Exceptions = require('../Exceptions').Exceptions;
const OperationType= Object.freeze({
    'Add' : 0,
    'Update' : 1,
    'Delete' : 2
});
exports.OperationType = OperationType;

exports.GenericUnitOfWork = class GenericUnitOfWork {
    constructor() {
        this.operations = [];
    }

    get() {
        return this.operations;
    }

    clear() {
        this.operations = [];
    }

    markClean(identifierValue) {
        var index = this.operations.findIndex(operation => {
            return operation.identifier === identifierValue;
        })
        if (index === -1) {
            console.log('Failed to mark identifier as clean in unit of work because identifier does not exist');
            throw Exceptions.InternalServerError;
        }
        else {
            this.operations.splice(index, 1);
        }
    }

    add(identifierValue){
        var previousOperation = this.operations.find(operation => {
            return operation.identifier === identifierValue;
        })
        if (previousOperation === undefined) {
            this.operations.push({'operationType': OperationType.Add, 'identifier': identifierValue});
        }
        else if (previousOperation.operationType === OperationType.Update || previousOperation.operationType === OperationType.Delete) {
            console.log("Failed to add identifier to unit of work because identifier is already used for update or delete operation.");
            throw Exceptions.InternalServerError;
        }
    }

    update(identifierValue){
        var previousOperation = this.operations.find(operation => {
            return operation.identifier === identifierValue;
        })
        if (previousOperation === undefined) {
            this.operations.push({'operationType': OperationType.Update, 'identifier': identifierValue});
        }
        else if (previousOperation.operationType === OperationType.Delete) {
            previousOperation.operationType = OperationType.Update;
        }
        else if (previousOperation.operationType === OperationType.Update) {
            console.log('Failed to update identifier in unit of work because identifier is already used for add operation');
            throw Exceptions.InternalServerError;
        }
        var previousOperation = this.operations.find(operation => {
            return operation.identifier === identifierValue;
        })
    }

    delete(identifierValue){
        var previousOperation = this.operations.find(operation => {
            return operation.identifier === identifierValue;
        })
        if (previousOperation === undefined) {
            this.operations.push({'operationType': OperationType.Delete, 'identifier': identifierValue});
        }
        else if (previousOperation.operationType === OperationType.Update) {
            previousOperation.operationType = OperationType.Delete;
        }
        else if (previousOperation.operationType === OperationType.Add) {
            console.log('Failed to delete identifier in unit of work because identifier is already used for add operation');
        }
    }

    // Only 1 operation can be associated with a unique catalogue item at any given time
}
const Exceptions = require('../Exceptions').Exceptions;
const OperationType= Object.freeze({
    'Add' : 0,
    'Update' : 1,
    'Delete' : 2
});

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

    add(identifierValue){
        if(!this.operations.find(i => {return i['identifier'] === identifierValue;})) 
        this.operations.push({'operationType': OperationType.Add, 'identifier': identifierValue});
        else if(this.operations.some(i => 
            { return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
            throw Exceptions.Unauthorized;
        }
        else if(this.operations.some(i => { return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;})){
            var item = this.operations.findIndex(i => {
                return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;
            });
            this.operations[item] = {'operationType': OperationType.Add, 'identifier': identifierValue};
        }
        else throw Exceptions.InvalidRequestBody;
    }

    updateItem(identifierValue){ 
        // update operations override add and previous update operations, but attempting to override a delete operation should throw an exception
        if(!this.operations.find(i => {return i['identifier'] === identifierValue;})) 
        this.operations.push({'operationType': OperationType.Update, 'identifier': identifierValue});
        else if(this.operations.some(i => 
            { return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
                var item = this.operations.findIndex(i => {
                    return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);
                });
                this.operations[item] = {'operationType': OperationType.Update, 'identifier': identifierValue};
        }
        else if(this.operations.some(i => { return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;})){
            throw Exceptions.Unauthorized;
        }
        else throw Exceptions.InvalidRequestBody;
    }

    deleteItem(identifierValue){
        // delete operations override add and update operations, but attempting to override a previous delete should throw an exception
        if(!this.operations.find(i => {return i['identifier'] === identifierValue;})) 
        this.operations.push({'operationType': OperationType.Delete, 'identifier': identifierValue});
        else if(this.operations.some(i => 
            { return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
                var item = this.operations.findIndex(i => {
                    return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);
                });
                this.operations[item] = {'operationType': OperationType.Delete, 'identifier': identifierValue};
        }
        else if(this.operations.some(i => { return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;})){
            throw Exceptions.Unauthorized;
        }
        else throw Exceptions.InvalidRequestBody;
    }

    // Only 1 operation can be associated with a unique catalogue item at any given time
}
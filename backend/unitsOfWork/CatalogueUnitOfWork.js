const catalogueMapper = require('../mappers/CatalogueMapper').getInstance();
const Exceptions = require('../Exceptions').Exceptions;
const OperationType= Object.freeze({
    'Add' : 0,
    'Update' : 1,
    'Delete' : 2
});

class CatalogueUnitOfWork {
    constructor() {
        // Operations are jsons with an operation type and an identifier
        // For example, an add book operation has the following format:
        // {operationType: OperationType.Add, identifier: isbn13 }
        this.bookOperations = []; // book identifier: isbn13
        this.magazineOperations = []; // magazine identifier: isbn13
        this.musicOperations = []; // music identifier: asin
        this.movieOperations = []; // movie identifier: eidr
    }

    async commit() {
        return new Promise ((resolve, reject) => {
            catalogueMapper.save({ // catalogueMapper doesn't have a save method yet. It will need to be added, but don't do that for now
                bookOperations: this.bookOperations,
                magazineOperations: this.magazineOperations,
                musicOperations: this.musicOperations,
                movieOperations: this.movieOperations
            })
            .then(() => {
                // commit successful, clear operation arrays
                resolve();
            })
            .catch(exception => {
                reject(500);
            })
        })
    }

    addItem(operationsArray, identifierValue){
        if(!operationsArray.find(i => {return i['identifier'] === identifierValue;})) 
            operationsArray.push({'operationType': OperationType.Add, 'identifier': identifierValue});
        else if(operationsArray.some(i => 
            { return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
            throw Exceptions.Unauthorized;
        }
        else if(operationsArray.some(i => { return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;})){
            var item = operationsArray.findIndex(i => {
                return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;
            });
            operationsArray[item] = {'operationType': OperationType.Add, 'identifier': identifierValue};
        }
        else throw Exceptions.InvalidRequestBody;
    }

    updateItem(operationsArray, identifierValue){ 
        // update operations override add and previous update operations, but attempting to override a delete operation should throw an exception
        if(!operationsArray.find(i => {return i['identifier'] === isbn13;})) 
            operationsArray.push({'operationType': OperationType.Update, 'identifier': isbn13});
        else if(operationsArray.some(i => 
            { return i['identifier'] === isbn13 && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
                var item = operationsArray.findIndex(i => {
                    return i['identifier'] === isbn13 && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);
                });
                operationsArray[item] = {'operationType': OperationType.Update, 'identifier': isbn13};
        }
        else if(operationsArray.some(i => { return i['identifier'] === isbn13 && i['operationType'] === OperationType.Delete;})){
            throw Exceptions.Unauthorized;
        }
        else throw Exceptions.InvalidRequestBody;
    }

    deleteItem(operationsArray, identifierValue){
        // delete operations override add and update operations, but attempting to override a previous delete should throw an exception
        if(!operationsArray.find(i => {return i['identifier'] === identifierValue;})) 
            operationsArray.push({'operationType': OperationType.Delete, 'identifier': identifierValue});
        else if(operationsArray.some(i => 
            { return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);})){
                var item = operationsArray.findIndex(i => {
                    return i['identifier'] === identifierValue && (i['operationType'] === OperationType.Add || i['operationType'] === OperationType.Update);
                });
                operationsArray[item] = {'operationType': OperationType.Delete, 'identifier': identifierValue};
        }
        else if(operationsArray.some(i => { return i['identifier'] === identifierValue && i['operationType'] === OperationType.Delete;})){
            throw Exceptions.Unauthorized;
        }
        else throw Exceptions.InvalidRequestBody;
    }

    // Only 1 operation can be associated with a unique catalogue item at any given time

    // Book Operations
    addBook (isbn13) {
        this.addItem(this.bookOperations, isbn13);
    }

    updateBook (isbn13) {
        this.updateItem(this.bookOperations, isbn13);
    }

    deleteBook (isbn13) {
        this.deleteItem(this.bookOperations, isbn13);
    }

    //Magazine
    addMagazine (isbn13) {
        this.addItem(this.magazineOperations, isbn13);
    }

    updateMagazine (isbn13) {
        this.updateItem(this.magazineOperations, isbn13);
    }

    deleteMagazine (isbn13) {
        this.deleteItem(this.magazineOperations, isbn13);
    }

     // Music Operations
    addMusic (asin) {
        this.addItem(this.musicOperations, asin);
    }

    updateMusic (asin) {
        this.updateItem(this.musicOperations, asin);
    }

    deleteMusic (asin) {
        this.deleteItem(this.musicOperations, asin);
    }

    // Movie Operations
    addMovie (eidr) {
        this.addItem(this.movieOperations, eidr);
    }

    updateMovie (eidr) {
        this.updateItem(this.movieOperations, eidr);
    }

    deleteMovie (eidr) {
        this.deleteItem(this.movieOperations, eidr);
    }

    // You also need add, update and delete methods for magazines, musics and movies
    // Because they're all going to be very similar, you should write generic add, update and delete methods
    // that you can call from within each specific method so that you don't have to write the same logic multiple times
}
const instance = new CatalogueUnitOfWork();
exports.getInstance = () => {
    return instance;
}
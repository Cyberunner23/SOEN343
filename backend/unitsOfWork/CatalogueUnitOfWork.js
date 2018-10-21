const catalogueMapper = require('../mappers/CatalogueMapper').getInstance()
const Operation = Object.freeze({
    'Add' : 0,
    'Update' : 1,
    'Delete' : 2
});
const Record = Object.freeze({
    'Book': 0,
    'Magazine': 1,
    'Music': 2,
    'Movie': 3
})

class CatalogueUnitOfWork {
    constructor() {
        // Operations are jsons with an operation type, record type and an identifier
        // For example, an add book operation has the following format:
        // {operationType: Operation.Add, recordType: Record.Book, identifier: isbn13 }
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

    // Only 1 operation can be associated with a unique catalogue item at any given time
    // add, update and delete are all valid operations for an identifier that wasn't already used

    addBook (isbn13) {
        // add operations override delete operations, but attempting to override a previous add or update should throw an exception
    }

    updateBook (isbn13) {
        // update operations override add and previous update operations, but attempting to override a delete operation should throw an exception
    }

    deleteBook (isbn13) {
        // delete operations override add and update operations, but attempting to override a previous delete should throw an exception
    }

    // You also need add, update and delete methods for magazines, musics and movies
    // Because they're all going to be very similar, you should write generic add, update and delete methods
    // that you can call from within each specific method so that you don't have to write the same logic multiple times
}
const instance = new CatalogueUnitOfWork();
exports.getInstance = () => {
    return instance;
}
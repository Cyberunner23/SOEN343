const Book = require('../business_objects/Book').Book;
const masterGateway = require('./MasterGateway').getInstance();

class BookGateway {
    
    async get(jsonFilters){
        return masterGateway.get('books', jsonFilters);
    }

    add(jsonBook){
        masterGateway.add('books', new Book(jsonBook));
    }

    update(jsonBook){
        masterGateway.update('books', new Book(jsonBook), 'isbn13');
    }

    delete(isbn13sToDelete){
        masterGateway.delete('books', 'isbn13', isbn13sToDelete);
    }
}

const instance = new BookGateway();
exports.getInstance = () => {
    return instance;
}
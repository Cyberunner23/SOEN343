const Book = require('../business_objects/Book').Book;
const masterGateway = require('./MasterGateway').getInstance();

class BookGateway {
    
    async getBooks(jsonFilters){
        return masterGateway.get('books', jsonFilters);
    }

    async addBook(jsonBook){
        return masterGateway.add('books', jsonBook);
    }

    async updateBook(jsonBook){
        return masterGateway.update('books', new Book(jsonBook), 'isbn13');
    }

    async deleteBooks(isbn13sToDelete){
        return masterGateway.delete('books', 'isbn13', isbn13sToDelete);
    }
}

const instance = new BookGateway();
exports.getInstance = () => {
    return instance;
}
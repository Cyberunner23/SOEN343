const Book = require('../business_objects/Book').Book;
const genericGateway = require('./GenericGatewayMethods');

class BookGateway {
    
    async getBooks(jsonFilters){
        return genericGateway.get('books', jsonFilters);
    }

    async addBook(jsonBook){
        return genericGateway.add('books', jsonBook);
    }

    async updateBook(jsonBook){
        return genericGateway.update('books', new Book(jsonBook), 'isbn13');
    }

    async deleteBooks(isbn13sToDelete){
        return genericGateway.delete('books', 'isbn13', isbn13sToDelete);
    }
}

const instance = new BookGateway();
exports.getInstance = () => {
    return instance;
}
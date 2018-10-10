const Book = require('../business_objects/Book').Book;

class InventoryMapper {
    constructor() {
        this.books = [];
    }

    getBooks(callback) {
        if (callback) {
            var filteredBooks = this.books.filter(book => {
                return callback(book);
            })
            return filteredBooks;
        }
        else {
            return this.books;
        }
    }

    async addBook(jsonBook) {
        return new Promise((resolve, reject) => {
            var newBook = new Book(jsonBook);
            this.books.push(newBook);
            resolve(newBook);
        })
    }

}

const instance = new InventoryMapper();

exports.getInstance = () => {
    return instance;
}
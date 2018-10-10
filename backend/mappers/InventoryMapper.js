const Book = require('../business_objects/Book').Book;

class InventoryMapper {
    constructor() {
        this.books = [];
    }

    async getBooks(jsonCriteria) {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(jsonCriteria);
            var filteredBooks = this.books.filter(book => {
                for (var key of keys) {
                    if (book[key] !== jsonCriteria[key]) {
                        return false; // filter out
                    }
                }
                return true; // keep
            })
            resolve(filteredBooks);
        })
    }

    async addBook(title) {
                return new Promise((resolve, reject) => {
                    var newBook = new Book(title);
                    this.books.push(newBook);
                    resolve(newBook);
                })
            }

}

    const instance = new InventoryMapper();

    exports.getInstance = () => {
        return instance;
    }
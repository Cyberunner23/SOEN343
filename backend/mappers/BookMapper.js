const Book = require('../business_objects/Book').Book;
const catalogGateway = require('../gateways/CatalogGateway').getInstance();

class BookMapper {
    
    constructor () {
        catalogGateway.loadBooks()
        .then(books => {
            this.books = books;
        })
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
            catalogGateway.addBook(newBook)
            .catch(exception => {
                reject(exception);
                return;
            })
            resolve(newBook);
        })
    }

    async removeBooks(callback) {
        return new Promise((resolve, reject) => {
            var removedBooks = [];
            if (callback) {
                this.books = this.books.filter(book => {
                    if(callback(book)) {
                        removedBooks.push(book);
                    }
                    return !callback(book);
                })
            } else {
                removedBooks = this.books;
                this.books = [];
            }
            var isbn13sToDelete = [];
            removedBooks.forEach(book => {
                isbn13sToDelete.push(book.isbn13);
            })
            catalogGateway.deleteBooks(isbn13sToDelete)
            .then(() => {
                resolve(removedBooks);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyBooks(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.books, modifyProperties, callback)
            .then(async arrayOfModifiedBooks => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedBooks.length && exception === null; i++) {
                    await catalogGateway.updateBook(arrayOfModifiedBooks[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else {
                    resolve(arrayOfModifiedBooks);
                }
            })
        })
    }

    /**
     * Modify items in the supplied cache that meet the selector criterea, with
     * the keys to be modified and their value in the supplied modifyProperties.
     * Return the modified objects.
     * 
     * @param {any[]} cache - The array of objects to select from
     * @param {JSON} modifyProperties - Collection of named properties and their values
     * @param {Function} [selector] - Function that takes a cache item and returns true 
     *                                if it is to be modified
     */
    async modify(cache, modifyProperties, selector) {
        return new Promise((resolve, reject) => {
            let toModify = [];

            // Select objects to modify
            if (selector) {
                toModify = cache.filter(selector);
            } else { // Without selector predicate, modify all items
                toModify = cache;
            }

            // Copy the properties defined in modifyProperties to selected items
            toModify.forEach((item) => {
                for (let property in modifyProperties) {
                    item[property] = modifyProperties[property];
                }
            });
            resolve(toModify);
        });
    }
}

const instance = new BookMapper();
exports.getInstance = () => {
    return instance;
}
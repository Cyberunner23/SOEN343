const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;


class InventoryMapper {
    constructor() {
        this.books = [];
        this.magazines = [];
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

    removeBook(callback) {
        return new Promise((resolve, reject) => {
            if (callback) {
                this.books = this.books.filter(book => {
                    return !callback(book);
                })
            }
            resolve(this.books);
        })
    }


    async addBook(jsonBook) {
        return new Promise((resolve, reject) => {
            var newBook = new Book(jsonBook);
            this.books.push(newBook);
            resolve(newBook);
        })
    }

    getMagazines(callback) {
        if (callback) {
            var filteredMagazines = this.magazines.filter(magazine => {
                return callback(magazine);
            })
            return filteredMagazines;
        }
        else {
            return this.magazines;
        }
    }

    async addMagazine(jsonMagazine) {
        return new Promise((resolve, reject) => {
            var newMagazine = new Magazine(jsonMagazine);
            this.magazines.push(newMagazine);
            resolve(newMagazine);
        })
    }

}

const instance = new InventoryMapper();

exports.getInstance = () => {
    return instance;
}
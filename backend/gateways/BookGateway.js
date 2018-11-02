const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Book = require('../business_objects/Book').Book;
const Exceptions = require('../Exceptions').Exceptions;

class BookGateway {
    
    async loadBooks(){
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM books";
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(getBookArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
    async addBook(jsonBook){
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO books (title, author, format, pages, publisher, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            var inserts = [jsonBook.title, jsonBook.author, jsonBook.format, jsonBook.pages,
                           jsonBook.publisher, jsonBook.language, jsonBook.isbn10, jsonBook.isbn13];
            query = mysql.format(query, inserts);            

            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    var newBook = new Book(jsonBook);
                    resolve (newBook);
                }
            });
        })
    }
    async updateBook(jsonBook){
        return new Promise((resolve, reject) => {
            var query = "UPDATE books SET title=?, author=?, format=?, pages=?, publisher=?, language=?, isbn10=? WHERE isbn13=?";
            var inserts = [jsonBook.title, jsonBook.author, jsonBook.format, jsonBook.pages,
                jsonBook.publisher, jsonBook.language, jsonBook.isbn10, jsonBook.isbn13];
            query = mysql.format(query, inserts);
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
                else {
                    resolve();
                }
            })
        })
    }
    async deleteBooks(isbn13sToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if (isbn13sToDelete) {
                query = 'DELETE FROM books WHERE isbn13 IN (' + isbn13sToDelete.join() + ')';
            }
            else {
                query = 'DELETE FROM books'
            }
        
            db.query(query, (err, result) => {
                if (!err) {
                    resolve();
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
}

const instance = new BookGateway();
exports.getInstance = () => {
    return instance;
}

getBookArray = (jsonBooks) => {
    var books = [];
    jsonBooks.forEach((jsonBook) => {
        books.push(new Book(jsonBook));
    })
    return books;
}
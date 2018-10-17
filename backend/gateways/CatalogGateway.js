const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie').Movie;
const Music = require('../business_objects/Music').Music;

class CatalogGateway{
    //books methods
    async loadBooks(){
        
    }
    async addBooks(jsonBook){
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
                    jsonBook.id = response.insertId;
                    var newBook = new Book(jsonBook);
                    resolve (newBook);
                }
            });
        })
    }
    async updateBooks(){
        
    }
    async deleteBooks(){
        
    }

    //magazines methods
    async addMagazines(){

    }
    async addMagazines(){

    }
    async updateMagazines(){

    }
    async deleteMagazines(){
        
    }

    //movies methods
    async loadMovies(){

    }
    async addMovies(){

    }
    async updateMovies(){

    }
    async deleteMovies(){

    }

    //music methods
    async loadMusic(){

    }
    async addMusic(){

    }
    async updateMusic(){

    }
    async deleteMusic(){

    }

    const instance = new CatalogGateway();
    exports.getInstance = () => {
        return instance;
    } //Creating new instance for CatalogGateway

    getBookArray = (jsonBooks) => {
        var books = [];
        jsonBooks.forEach((jsonBook) => {
            books.push(new Book(jsonBook));
        })
        return books;
    } //Generates an array of all Books for modification
}

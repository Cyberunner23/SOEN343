const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie').Movie;
const Music = require('../business_objects/Music').Music;

class CatalogGateway{
    //books methods
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
            var query = "UPDATE Books SET title=? AND author=? AND format=? AND pages=? AND publisher=? AND language=? WHERE isbn10=?";
            var inserts = [jsonBook.title, jsonBook.author, jsonBook.format, jsonBook.pages,
                jsonBook.publisher, jsonBook.language, jsonBook.isbn10];
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
    async deleteBooks(isbnsToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if (idsToRemove) {
                query = 'DELETE FROM Books WHERE isbn10 IN (' + isbnsToDelete.join() + ')';
            }
            else {
                query = 'DELETE FROM Books'
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

    //magazines methods
    async loadMagazines(){

    }
    async addMagazine(){

    }
    async updateMagazine(){

    }
    async deleteMagazines(){
        
    }

    //movies methods
    async loadMovies(){
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM movies";
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(getMovieArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
    async addMovie(jsonMovie){
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO movies (title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            var inserts = [jsonMovie.title, jsonMovie.director, jsonMovie.producers, jsonMovie.actors,
                           jsonMovie.language, jsonMovie.subtitles, jsonMovie.dubbed, jsonMovie.releaseDate jsonMovie.runTime, jsonMovie.eidr];
            query = mysql.format(query, inserts);
            
            db.query(query, (err, response) => {
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    var newMovie = new Movie(jsonMovie);
                    resolve (newMovie);
                }
            });
        })
    }
    async updateMovie(jsonMovie){
        return new Promise((resolve, reject) => {
            var query = "UPDATE Movies SET title=? AND director=? AND producers=? AND actors=? AND language=? AND subtitles=? AND dubbed=? AND releaseDate=? AND runTime=? WHERE eidr=?";
            var inserts = [jsonMovie.title, jsonMovie.director, jsonMovie.producers, jsonMovie.actors,
                           jsonMovie.language, jsonMovie.subtitles, jsonMovie.dubbed, jsonMovie.releaseDate jsonMovie.runTime, jsonMovie.eidr];
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
    async deleteMovies(eidrsToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if (eidrsToDelete) {
                query = 'DELETE FROM Movies WHERE eidr IN (' + eidrsToDelete.join() + ')';
            }
            else {
                query = 'DELETE FROM Movies'
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

    //music methods
    async loadMusics(){

    }
    async addMusic(){

    }
    async updateMusic(){

    }
    async deleteMusics(){

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

    getMovieArray = (jsonMovies) => {
        var movies = [];
        jsonMovies.forEach((jsonMovie) => {
            movies.push(new Movie(jsonMovie));
        })
        return movies;
    } //Generates an array of all Movies for modification
}

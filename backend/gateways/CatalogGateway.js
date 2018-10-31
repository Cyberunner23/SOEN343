const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie').Movie;
const Music = require('../business_objects/Music').Music;
const Exceptions = require('../Exceptions').Exceptions;

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

    //magazines methods
    async loadMagazines(){
        return new Promise((resolve,reject) => {
            var query= "SELECT * FROM magazines";
            db.query(query, (err,result) => {
                if(!err){
                    resolve(getMagazineArray(result));
                }else{
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
    async addMagazine(jsonMagazines){
        return new Promise((resolve,reject) => {
            var query= 'INSERT INTO magazines (title, publisher, date, language, isbn10, isbn13) VALUES(?,?,?,?,?,?)';
            var inserts= [jsonMagazines.title, jsonMagazines.publisher, jsonMagazines.date, jsonMagazines.language, 
                         jsonMagazines.isbn10, jsonMagazines.isbn13];
                
            query=mysql.format(query,inserts);

            db.query(query, (err,response) => {
                if(err){
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }else{
                   var newMagazine= new Magazine(jsonMagazines);
                   resolve(newMagazine);
                }
            }); 
        })  
    }
    async updateMagazine(jsonMagazines){
        return new Promise((resolve,reject) => {
            var query= "UPDATE magazines SET title=?, publisher=?, date=?, language=?, isbn10=? WHERE isbn13=?";
            var inserts=[jsonMagazines.title, jsonMagazines.publisher, jsonMagazines.date, jsonMagazines.language, 
                jsonMagazines.isbn10, jsonMagazines.isbn13];
            query=mysql.format(query,inserts);
            db.query(query, (err,response) => {
                if(err){
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }else{
                   resolve();
                }
            })
        })
    }
    async deleteMagazines(isbn13sToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if(isbn13sToDelete)  {
                query='DELETE FROM magazines WHERE isbn13 IN (' + isbn13sToDelete.join() + ')';
            }else{
                query='Delete FROM magazines';
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
                           jsonMovie.language, jsonMovie.subtitles, jsonMovie.dubbed, jsonMovie.releaseDate, jsonMovie.runTime, jsonMovie.eidr];
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
            var query = "UPDATE movies SET title=?, director=?, producers=?, actors=?, language=?, subtitles=?, dubbed=?, releaseDate=?, runTime=? WHERE eidr=?";
            var inserts = [jsonMovie.title, jsonMovie.director, jsonMovie.producers, jsonMovie.actors,
                           jsonMovie.language, jsonMovie.subtitles, jsonMovie.dubbed, jsonMovie.releaseDate, jsonMovie.runTime, jsonMovie.eidr];
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
                query = 'DELETE FROM movies WHERE eidr IN (' + eidrsToDelete.join() + ')';
            }
            else {
                query = 'DELETE FROM movies'
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
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM musics";
            db.query(query, (err, result) => {
                if (!err) {
                    resolve(getMusicArray(result));
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })

    }
    async addMusic(jsonMusic){
        return new Promise ((resolve, reject) => {
            var query='INSERT INTO musics (type, title, artist, label, releaseDate, asin ) VALUES (?,?,?,?,?,?)';
            var inserts=[jsonMusic.type, jsonMusic.title, jsonMusic.artist, 
                jsonMusic.label, jsonMusic.releaseDate, jsonMusic.asin];
            query = mysql.format(query, inserts);  
            
            db.query(query, (err, response)=>{
                if (err) {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                } else {
                    var newMusic = new Music(jsonMusic);
                    resolve (newMusic);
                }
            });
        })
    }
    
    async updateMusic(jsonMusic){
        return new Promise((resolve,reject) => {
            var query="UPDATE musics SET type=?, title=?, artist=?, label=?, releaseDate=? WHERE asin=?";
            var inserts=[jsonMusic.type, jsonMusic.title, jsonMusic.artist, 
                jsonMusic.label, jsonMusic.releaseDate, jsonMusic.asin];
            query=mysql.format(query, inserts);
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
    async deleteMusics(asinToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if(asinToDelete){
                query= 'DELETE FROM musics WHERE asin IN (' + asinToDelete.join() + ')';
            }else{
                query='DELETE FROM musics';
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

getMagazineArray = (jsonMagazines) => {
    var magazines = [];
    jsonMagazines.forEach((jsonMagazine) => {
        magazines.push(new Book(jsonMagazine));
    })
    return magazines;
} //Generates an array of all Magazines for modification

getMusicArray = (jsonMusics) => {
    var musics = [];
    jsonMusics.forEach((jsonMusic) => {
        musics.push(new Music(jsonMusic));
    })
    return musics;
} //Generates an array of all musics for modification


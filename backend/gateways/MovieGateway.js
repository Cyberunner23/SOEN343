const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Movie = require('../business_objects/Movie').Movie;
const Exceptions = require('../Exceptions').Exceptions;

class MovieGateway {
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
}

const instance = new MovieGateway();
exports.getInstance = () => {
    return instance;
}
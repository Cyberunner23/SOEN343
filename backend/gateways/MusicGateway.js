const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Music = require('../business_objects/Music').Music;
const Exceptions = require('../Exceptions').Exceptions;

class MusicGateway {

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

const instance = new MusicGateway();
exports.getInstance = () => {
    return instance;
}

getMovieArray = (jsonMovies) => {
    var movies = [];
    jsonMovies.forEach((jsonMovie) => {
        movies.push(new Movie(jsonMovie));
    })
    return movies;
}

getMusicArray = (jsonMusics) => {
    var musics = [];
    jsonMusics.forEach((jsonMusic) => {
        musics.push(new Music(jsonMusic));
    })
    return musics;
}
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
    async insertBooks(){

    }
    async updateBooks(){

    }
    async deleteBooks(){

    }

    //magazines methods
    async insertMagazines(){

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
    async insertMovies(){

    }
    async updateMovies(){

    }
    async deleteMovies(){

    }

    //music methods
    async loadMusic(){

    }
    async insertMusic(){

    }
    async updateMusic(){

    }
    async deleteMusic(){

    }
}

const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie.js').Movie;
const Music = require('../business_objects/Music.js').Music


class InventoryMapper {
    constructor() {
        this.books = [];
        this.magazines = [];
        this.movies = [];
        this.music = [];
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
            resolve(newBook);
        })
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

    removeMagazine(callback) {
        return new Promise((resolve, reject) => {
            if (callback) {
                this.magazines = this.magazines.filter(magazine => {
                    return !callback(magazine);
                })
            }
            resolve(this.magazines);
        })
    }

    getMovies(callback) {
        if (callback) {
            var filteredMovies = this.movies.filter(movie => {
                return callback(movie);
            })
            return filteredMovies;
        }
        else {
            return this.movies;
        }
    }

    async addMovie(jsonMovie) {
        return new Promise((resolve, reject) => {
            var newMovie = new Movie(jsonMovie);
            this.movies.push(newMovie);
            resolve(newMovie);
        })
    }

    removeMovie(callback) {
        return new Promise((resolve, reject) => {
            if (callback) {
                this.movies = this.movies.filter(movie => {
                    return !callback(movie);
                })
            }
            resolve(this.movies);
        })
    }

    getMusics(callback) {
        if (callback) {
            var filteredMusics = this.musics.filter(music => {
                return callback(music);
            })
            return filteredMusics;
        }
        else {
            return this.musics;
        }
    }

    async addMusic(jsonMusic) {
        return new Promise((resolve, reject) => {
            var newMusic = new Music(jsonMusic);
            this.musics.push(newMusic);
            resolve(newMusic);
        })
    }

    removeMusic(callback) {
        return new Promise((resolve, reject) => {
            if (callback) {
                this.musics = this.musics.filter(music => {
                    return !callback(music);
                })
            }
            resolve(this.musics);
        })
    }

}

const instance = new InventoryMapper();

exports.getInstance = () => {
    return instance;
}

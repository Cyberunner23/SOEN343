const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie.js').Movie;
const Music = require('../business_objects/Music.js').Music


class CatalogueMapper {
    constructor() {
        this.books = [];
        this.magazines = [];
        this.movies = [];
        this.musics = [];
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

    async removeBook(callback) {
        return new Promise((resolve, reject) => {
            var removedBooks = [];
            if (callback) {
                this.books = this.books.filter(book => {
                    if(callback(book)) {
                        removedBooks.push(book);
                    }
                    return !callback(book);
                })
            }
            resolve(removedBooks);
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

    async removeMagazine(callback) {
        return new Promise((resolve, reject) => {
            var removedMagazines = []
            if (callback) {
                this.magazines = this.magazines.filter(magazine => {
                    if(callback(magazine)) {
                        removedMagazines.push(magazine);
                    }
                    return !callback(magazine);
                })
            }
            resolve(removedMagazines);
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

    async removeMovie(callback) {
        return new Promise((resolve, reject) => {
            var removedMovies = [];
            if (callback) {
                this.movies = this.movies.filter(movie => {
                    if(callback(movie)) {
                        removedMovies.push(movie);
                    }
                    return !callback(movie);
                })
            }
            resolve(emovedMovies);
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

    async removeMusic(callback) {
        return new Promise((resolve, reject) => {
            var removedMusic = [];
            if (callback) {
                this.musics = this.musics.filter(music => {
                    if(callback(music)) {
                        removedMusic.push(music);
                    }
                    return !callback(music);
                })
            }
            resolve(removedMusic);
        })
    }

}

const instance = new CatalogueMapper();

exports.getInstance = () => {
    return instance;
}

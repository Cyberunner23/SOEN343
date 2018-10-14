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

    async removeBooks(callback) {
        return new Promise((resolve, reject) => {
            var removedBooks = [];
            if (callback) {
                this.books = this.books.filter(book => {
                    if(callback(book)) {
                        removedBooks.push(book);
                    }
                    return !callback(book);
                })
            } else {
                removedBooks = this.books;
                this.books = [];
            }
            resolve(removedBooks);
        })
    }

    async modifyBooks(modifyProperties, callback) {
        return this.modify(this.books, modifyProperties, callback);
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

    async removeMagazines(callback) {
        return new Promise((resolve, reject) => {
            var removedMagazines = []
            if (callback) {
                this.magazines = this.magazines.filter(magazine => {
                    if(callback(magazine)) {
                        removedMagazines.push(magazine);
                    }
                    return !callback(magazine);
                })
            } else {
                removedMagazines = this.magazines;
                this.magazines = [];
            }
            resolve(removedMagazines);
        })
    }

    async modifyMagazines(modifyProperties, callback) {
        return this.modify(this.magazines, modifyProperties, callback);
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

    async removeMovies(callback) {
        return new Promise((resolve, reject) => {
            var removedMovies = [];
            if (callback) {
                this.movies = this.movies.filter(movie => {
                    if(callback(movie)) {
                        removedMovies.push(movie);
                    }
                    return !callback(movie);
                })
            } else {
                removedMovies = this.movies;
                this.movies = [];
            }
            resolve(removedMovies);
        })
    }

    async modifyMovies(modifyProperties, callback) {
        return this.modify(this.movies, modifyProperties, callback);
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

    async removeMusics(callback) {
        return new Promise((resolve, reject) => {
            var removedMusic = [];
            if (callback) {
                this.musics = this.musics.filter(music => {
                    if(callback(music)) {
                        removedMusic.push(music);
                    }
                    return !callback(music);
                })
            } else {
                removedMusic = this.musics;
                this.musics = [];
            }
            resolve(removedMusic);
        })
    }

    async modifyMusics(modifyProperties, callback) {
        return this.modify(this.musics, modifyProperties, callback);
    }

    /**
     * Modify items in the supplied cache that meet the selector criterea, with
     * the keys to be modified and their value in the supplied modifyProperties.
     * Return the modified objects.
     * 
     * @param {any[]} cache - The array of objects to select from
     * @param {JSON} modifyProperties - Collection of named properties and their values
     * @param {Function} [selector] - Function that takes a cache item and returns true 
     *                                if it is to be modified
     */
    async modify(cache, modifyProperties, selector) {
        return new Promise((resolve, reject) => {
            let toModify = [];

            // Select objects to modify
            if (selector) {
                toModify = cache.filter(selector);
            } else { // Without selector predicate, modify all items
                toModify = cache;
            }

            // Copy the properties defined in modifyProperties to selected items
            toModify.forEach((item) => {
                for (let property in modifyProperties) {
                    item[property] = modifyProperties[property];
                }
            });
            resolve(toModify);
        });
    }
}

const instance = new CatalogueMapper();

exports.getInstance = () => {
    return instance;
}

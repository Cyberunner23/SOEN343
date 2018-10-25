const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie.js').Movie;
const Music = require('../business_objects/Music.js').Music
const catalogGateway = require('../gateways/CatalogGateway').getInstance();

class CatalogueMapper {
    constructor() {
        catalogGateway.loadBooks()
        .then(books => {
            this.books = books;
        })
        catalogGateway.loadMagazines()
        .then(magazines => {
            this.magazines = magazines;
        })
        catalogGateway.loadMovies()
        .then(movies => {
            this.movies = movies;
        })
        catalogGateway.loadMusics()
        .then(musics => {
            this.musics = musics
        })
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
            catalogGateway.addBook(newBook)
            .catch(exception => {
                reject(exception);
                return;
            })
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
            var isbn13sToDelete = [];
            removedBooks.forEach(book => {
                isbn13sToDelete.push(book.isbn13);
            })
            catalogGateway.deleteBooks(isbn13sToDelete)
            .then(() => {
                resolve(removedBooks);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyBooks(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.books, modifyProperties, callback)
            .then(async arrayOfModifiedBooks => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedBooks.length && exception === null; i++) {
                    await catalogGateway.updateBook(arrayOfModifiedBooks[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else {
                    resolve(arrayOfModifiedBooks);
                }
            })
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
            catalogGateway.addMagazine(newMagazine)
            .catch(exception => {
                reject(exception);
                return;
            })
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
            var isbn13sToDelete = [];
            removedMagazines.forEach(magazine => {
                isbn13sToDelete.push(magazine.isbn13);
            })
            catalogGateway.deleteMagazines(isbn13sToDelete)
            .then(() => {
                resolve(removedMagazines);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyMagazines(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.magazines, modifyProperties, callback)
            .then(async arrayOfModifiedMagazines => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedMagazines.length && exception === null; i++) {
                    await catalogGateway.updateMagazine(arrayOfModifiedMagazines[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else { 
                    resolve(arrayOfModifiedMagazines);
                }
            })
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
            catalogGateway.addMovie(newMovie)
            .catch(exception => {
                reject(exception);
                return;
            })
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
            var eidrsToDelete = [];
            removedMovies.forEach(movie => {
                eidrsToDelete.push(movie.eidr);
            })
            catalogGateway.deleteMovies(eidrsToDelete)
            .then(() => {
                resolve(removedMovies);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyMovies(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.movies, modifyProperties, callback)
            .then(async arrayOfModifiedMovies => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedMovies.length && exception === null; i++) {
                    await catalogGateway.updateMovie(arrayOfModifiedMovies[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else { 
                    resolve(arrayOfModifiedMovies);
                }
            })
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
            catalogGateway.addMusic(newMusic)
            .catch(exception => {
                reject(exception);
                return;
            })
            resolve(newMusic);
        })
    }

    async removeMusics(callback) {
        return new Promise((resolve, reject) => {
            var removedMusics = [];
            if (callback) {
                this.musics = this.musics.filter(music => {
                    if(callback(music)) {
                        removedMusics.push(music);
                    }
                    return !callback(music);
                })
            } else {
                removedMusics = this.musics;
                this.musics = [];
            }
            var asinsToDelete = [];
            removedMusics.forEach(music => {
                asinsToDelete.push(music.asin);
            })
            catalogGateway.deleteMusics(asinsToDelete)
            .then(() => {
                resolve(removedMusics);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyMusics(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.musics, modifyProperties, callback)
            .then(async arrayOfModifiedMusics => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedMusics.length && exception === null; i++) {
                    await catalogGateway.updateMusic(arrayOfModifiedMusics[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else { 
                    resolve(arrayOfModifiedMusics);
                }
            })
        })
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

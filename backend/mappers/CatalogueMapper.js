const Book = require('../business_objects/Book').Book;
const Magazine = require('../business_objects/Magazine').Magazine;
const Movie = require('../business_objects/Movie.js').Movie;
const Music = require('../business_objects/Music.js').Music
const catalogGateway = require('../gateways/CatalogGateway').getInstance();


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
            catalogGateway.addBook(jsonBook)
            .then(newBook => {
                this.books.push(newBook);
                resolve(newBook);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async removeBooks(callback) {
        return new Promise((resolve, reject) => {
            var removedBooks = [];
            var isbn13sToDelete = [];

            if (callback) {

                removedBooks = this.books.filter(book => {
                    return callback(book);
                })

                this.books = this.books.filter(book => {
                    return ! callback(book);
                })

                if (removedBooks.length > 0) {
                    removedBooks.forEach(book => {
                        isbn13sToDelete.push(book.isbn13);
                    })
                }
                else {
                    // no book to remove
                    resolve([]);
                    return;
                }
            }
            else {
                console.log('Removing all books. Hopefully this is actually what you wanted to do.');
                removedBooks = this.books.splice(0, this.books.length);
                removedBooks.forEach(book => {
                    isbn13sToDelete.push(book.isbn13);
                })
            }


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
        return new Promise((resolve, reject) => {	
			this.modify(this.books, modifyProperties, callback);
			.then(arrayOfModifiedBooks => {
				var exception;
				for (var i = 0 ; i < arrayOfModifiedBooks.length && !exception; i++)
					catalogGateway.updateBook(arrayOfModifiedBooks[i])
					.catch(e => {
						exception = e;
					})
                if (exception) {
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
            var eidrsToDelete = [];

            if (callback) {

                removedMovies = this.movies.filter(movie => {
                    return callback(movie);
                })

                this.movies = this.movies.filter(movie => {
                    return ! callback(movie);
                })

                if (removedMovies.length > 0) {
                    removedMovies.forEach(movie => {
                        eidrsToDelete.push(movie.eidr);
                    })
                }
                else {
                    // no movie to remove
                    resolve([]);
                    return;
                }
            }
            else {
                console.log('Removing all movies. Hopefully this is actually what you wanted to do.');
                removedMovies = this.movies.splice(0, this.movies.length);
                removedMovies.forEach(movie => {
                    eidrsToDelete.push(movie.eidr);
                })
            }


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
        return new Promise((resolve, reject) => {	
			this.modify(this.movies, modifyProperties, callback);
			.then(arrayOfModifiedMovies => {
				var exception;
				for (var i = 0 ; i < arrayOfModifiedMovies.length && !exception; i++)
					catalogGateway.updateMovie(arrayOfModifiedMovies[i])
					.catch(e => {
						exception = e;
					})
                if (exception) {
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

            if(cache.length === 0) {
                return []; // Early exit if there are no items to modify
            }

            // Validate incoming properties
            let validObject = cache[0]; // Guaranteed to exist by early exit test
            for (let property in modifyProperties) {
                if (!validObject.hasOwnProperty(property)) {
                    console.error(`Error: Attempting to add property ${property} to object ${validObject.constructor.name}`);
                    return [];
                }
            }

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

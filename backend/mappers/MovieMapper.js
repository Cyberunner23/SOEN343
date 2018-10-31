const Movie = require('../business_objects/Movie.js').Movie;
const movieGateway = require('../gateways/MovieGateway').getInstance();

class MovieMapper {
    
    constructor () {
        movieGateway.loadMovies()
        .then(movies => {
            this.movies = movies;
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
            movieGateway.addMovie(newMovie)
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
            movieGateway.deleteMovies(eidrsToDelete)
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
                    await movieGateway.updateMovie(arrayOfModifiedMovies[i])
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

const instance = new MovieMapper();
exports.getInstance = () => {
    return instance;
}
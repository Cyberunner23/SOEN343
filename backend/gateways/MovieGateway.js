const Movie = require('../business_objects/Movie').Movie;
const masterGateway = require('./MasterGateway').getInstance();

class MovieGateway {
    
    async getMovies(jsonFilters){
        return masterGateway.get('movies', jsonFilters);
    }

    async addMovie(jsonMovie){
        return masterGateway.add('movies', jsonMovie);
    }

    async updateMovie(jsonMovie){
        return masterGateway.update('movies', new Movie(jsonMovie), 'eidr');
    }

    async deleteMovies(eidrsToDelete){
        return masterGateway.delete('movies', 'eidr', eidrsToDelete);
    }
}

const instance = new MovieGateway();
exports.getInstance = () => {
    return instance;
}
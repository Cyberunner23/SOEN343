const Movie = require('../business_objects/Movie').Movie;
const genericGateway = require('./GenericGatewayMethods');

class MovieGateway {
    
    async getMovies(jsonFilters){
        return genericGateway.get('movies', jsonFilters);
    }

    async addMovie(jsonMovie){
        return genericGateway.add('movies', jsonMovie);
    }

    async updateMovie(jsonMovie){
        return genericGateway.update('movies', new Movie(jsonMovie), 'eidr');
    }

    async deleteMovies(eidrsToDelete){
        return genericGateway.delete('movies', 'eidr', eidrsToDelete);
    }
}

const instance = new MovieGateway();
exports.getInstance = () => {
    return instance;
}
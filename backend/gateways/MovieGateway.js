const Movie = require('../business_objects/Movie').Movie;
const masterGateway = require('./MasterGateway').getInstance();

class MovieGateway {
    
    async get(jsonFilters){
        return masterGateway.get('movies', jsonFilters);
    }

    add(jsonMovie){
        masterGateway.add('movies', new Movie(jsonMovie));
    }

    update(jsonMovie){
        masterGateway.update('movies', new Movie(jsonMovie), 'eidr');
    }

    delete(eidrsToDelete){
        masterGateway.delete('movies', 'eidr', eidrsToDelete);
    }
}

const instance = new MovieGateway();
exports.getInstance = () => {
    return instance;
}
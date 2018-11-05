GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
movieMapper = require('../mappers/MovieMapper').getInstance();
Movie = require('../business_objects/Movie').Movie;

class MovieController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = movieMapper;
        this.recordName = 'movie';
        this.identifier = 'eidr';
        this.recordType = Movie;
    }
}

const instance = new MovieController();
exports.getInstance = () => {
    return instance;
}
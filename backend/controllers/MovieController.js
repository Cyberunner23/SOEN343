GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
movieMapper = require('../mappers/MovieMapper').getInstance();

class MovieController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = movieMapper;
        this.recordName = 'movie';
        this.identifier = 'eidr';
    }
}

const instance = new MovieController();
exports.getInstance = () => {
    return instance;
}
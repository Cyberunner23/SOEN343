GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
musicMapper = require('../mappers/MusicMapper').getInstance();

class MusicController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = musicMapper;
        this.recordName = 'music';
        this.identifier = 'asin';
    }
}

const instance = new MusicController();
exports.getInstance = () => {
    return instance;
}
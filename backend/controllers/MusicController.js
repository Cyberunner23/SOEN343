GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
musicMapper = require('../mappers/MusicMapper').getInstance();
Music = require('../business_objects/Music').Music;

class MusicController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = musicMapper;
        this.recordName = 'music';
        this.identifier = 'asin';
        this.recordType = Music;
    }
}

const instance = new MusicController();
exports.getInstance = () => {
    return instance;
}
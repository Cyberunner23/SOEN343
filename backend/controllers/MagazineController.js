GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
magazineMapper = require('../mappers/MagazineMapper').getInstance();

class MagazineController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = magazineMapper;
        this.recordName = 'magazine';
        this.identifier = 'isbn13';
    }
}

const instance = new MagazineController();
exports.getInstance = () => {
    return instance;
}
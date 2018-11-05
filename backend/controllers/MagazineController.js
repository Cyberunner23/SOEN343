GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
magazineMapper = require('../mappers/MagazineMapper').getInstance();
Magazine = require('../business_objects/Magazine').Magazine;

class MagazineController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = magazineMapper;
        this.recordName = 'magazine';
        this.identifier = 'isbn13';
        this.recordType = Magazine;
    }
}

const instance = new MagazineController();
exports.getInstance = () => {
    return instance;
}
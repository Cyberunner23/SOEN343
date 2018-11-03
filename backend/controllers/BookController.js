GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
bookMapper = require('../mappers/BookMapper').getInstance();

class BookController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = bookMapper;
        this.recordName = 'book';
        this.identifier = 'isbn13';
    }
}

const instance = new BookController();
exports.getInstance = () => {
    return instance;
}
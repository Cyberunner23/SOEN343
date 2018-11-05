GenericCatalogueController = require('./GenericCatalogueController').GenericCatalogueController;
bookMapper = require('../mappers/BookMapper').getInstance();
Book = require('../business_objects/Book').Book;

class BookController extends GenericCatalogueController {
    constructor() {
        super();
        this.mapper = bookMapper;
        this.recordName = 'book';
        this.identifier = 'isbn13';
        this.recordType = Book;
    }
}

const instance = new BookController();
exports.getInstance = () => {
    return instance;
}
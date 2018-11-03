const GenericMapper = require('./GenericMapper').GenericMapper;
const bookIdentityMap = require('../identity_maps/BookIdentityMap').getInstance();
const bookGateway = require('../gateways/BookGateway').getInstance();

class BookMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'isbn13';
        this.identityMap = bookIdentityMap;
        this.gateway = bookGateway;
        this.initialize();
    }
}

const instance = new BookMapper();
exports.getInstance = () => {
    return instance;
}
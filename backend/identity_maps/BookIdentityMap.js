const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class BookIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'isbn13';
    }
}

const instance = new BookIdentityMap();
exports.getInstance = () => {
    return instance;
}
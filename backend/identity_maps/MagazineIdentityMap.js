const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class MagazineIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'isbn13';
    }
}

const instance = new MagazineIdentityMap();
exports.getInstance = () => {
    return instance;
}
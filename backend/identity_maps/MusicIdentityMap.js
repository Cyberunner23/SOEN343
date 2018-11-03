const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class MusicIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'asin';
    }
}

const instance = new MusicIdentityMap();
exports.getInstance = () => {
    return instance;
}
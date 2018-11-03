const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class MovieIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'eidr';
    }
}

const instance = new MovieIdentityMap();
exports.getInstance = () => {
    return instance;
}
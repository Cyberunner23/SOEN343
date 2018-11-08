const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class CartItemIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'id';
    }
}

const instance = new CartItemIdentityMap();
exports.getInstance = () => {
    return instance;
}
const GenericMapper = require('./GenericMapper').GenericMapper;
const cartItemIdentityMap = require('../identity_maps/CartItemIdentityMap').getInstance();
const cartItemGateway = require('../gateways/CartItemGateway').getInstance();

class CartItemMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'cartItemId';
        this.identityMap = cartItemIdentityMap;
        this.gateway = cartItemGateway;
    }
}

const instance = new CartItemMapper();
exports.getInstance = () => {
    return instance;
}
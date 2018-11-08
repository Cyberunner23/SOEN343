const CartItem = require('../business_objects/CartItem').CartItem;
const masterGateway = require('./MasterGateway').getInstance();

class CartItemGateway {
    
    async get(jsonFilters){
        return masterGateway.get('cartItems', jsonFilters);
    }

    add(jsonCartItem){
        masterGateway.add('cartItems', new CartItem(jsonCartItem));
    }

    update(jsonCartItem){
        masterGateway.update('cartItems', new CartItem(jsonCartItem), 'id');
    }

    delete(idsToDelete){
        masterGateway.delete('cartItems', 'id', idsToDelete);
    }
}

const instance = new CartItemGateway();
exports.getInstance = () => {
    return instance;
}
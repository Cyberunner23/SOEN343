const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// addToCart, removeFromCart and getCartItems
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const cartItemMapper = require('../mappers/CartItemMapper').getInstance();
const CartItem = require('../business_objects/CartItem').CartItem;

class CartItemController {
    constructor() {
        this.mapper = cartItemMapper;
        this.recordName = 'cartItem';
        this.identifier = 'id';
        this.recordType = CartItem;
        this.getCartItems = this.getCartItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    async getCartItems(req, res) {
        // req.body.authToken
        // req.body.filters
    }
    
    async addToCart (req, res) {
        // req.body.authToken
        // req.body.recordId
    }
    
    async removeFromCart (req, res) {
        // req.body.authToken
        // req.body.recordId
    }
}

const instance = new CartItemController();
exports.getInstance = () => {
    return instance;
}

handleException = function(res, exception) {
    var message;
    switch(exception){
        case Exceptions.BadRequest:
            message = "BadRequest";
            res.status(400);
            break;
        case Exceptions.Unauthorized:
            message = "Unauthorized";
            res.status(401);
            break;
        case Exceptions.InternalServerError:
        default:
            message = "InternalServerError";
            res.status(500);
            break;
    }
    res.json({err: message});
}
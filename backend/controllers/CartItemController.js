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
        this.identifier = 'cartItemId';
        this.recordType = CartItem;
        this.getCartItems = this.getCartItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    async getCartItems(req, res) 
    {
        identifyUser(req.body.authToken)
        .then(async user => 
        {
            // Users only
            if (user.is_admin)
            {
                handleException(res, Exceptions.Unauthorized);
                return;
            }
			this.mapper.get(req.query)
			.then(records => {
				res.status(200);
				res.json(records);
			})
			.catch(ex => {
				handleException(res, ex);
			})
        })
        .catch(ex => 
        {
            handleException(res, ex);
        });
    }
    
    async addToCart (req, res) 
    {
        identifyUser(req.body.authToken)
        .then(async user => 
        {
            // Users only
            if (user.is_admin)
            {
                handleException(res, Exceptions.Unauthorized);
                return;
            }
			
            this.mapper.add(new this.recordType(req.body))
            .then(record => {
                res.status(200);
                res.json(record);
            })

            // req.body.recordId
        })
        .catch(ex => 
        {
            handleException(res, ex);
        });
    }
    
    async removeFromCart (req, res) 
    {
        identifyUser(req.body.authToken)
        .then(user => {
            if(user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.remove(filters)
            .then(removedRecords => {
                if (removedRecords.length === 0) {
                    handleException(res, Exceptions.BadRequest);
                }
                else {
                    res.status(200);
                    res.json(removedRecords[0]); // There should be only 1 record because the filter is a unique identifier
                }
            })
            .catch(ex => {
                handleException(res, ex);
            });
        })
        .catch((ex) => {
            handleException(res, ex);
        });
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

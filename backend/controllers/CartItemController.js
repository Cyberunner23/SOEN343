const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// addToCart, removeFromCart and getCartItems
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const cartItemMapper = require('../mappers/CartItemMapper').getInstance();
const CartItem = require('../business_objects/CartItem').CartItem;
const transactionMapper = require('../mappers/TransactionMapper').getInstance();
const maxBorrows = 5;

class CartItemController {
    constructor() {
        this.mapper = cartItemMapper;
        this.recordName = 'cartItem';
        this.identifier = 'cartItemId';
        this.getCartItems = this.getCartItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
		this.transactionMapper = transactionMapper;
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
			var filter = {userId: user.id};
			await this.mapper.get(filter)
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
			
            var borrowLimit = await getNumBorrowsRemaining(user);
			
			if (borrowLimit > 0){
                var props = {cartItemId: guid(), userId: user.id, mediaType: req.body.mediaType, mediaId: req.body.mediaId};
                this.mapper.add(new CartItem(props))
                .then(record => {
                    res.status(200);
                    res.json(record);
                })}
                else{
                    handleException(res, Exceptions.BadRequest);
                }
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
            var filters = {cartItemId: req.body.cartItemId};
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

getNumBorrowsRemaining = async user => {
    var filter = {userId: user.id, isReturned: 0};
    var transactLen;
    await transactionMapper.get(filter)
    .then(values => {
        transactLen = values.length;
    })
    .catch(ex => {
        console.log('failed to get transactions');
        handleException(res, ex);
    })
    
    return maxBorrows - transactLen;
}
exports.getNumBorrowsRemaining = getNumBorrowsRemaining;

s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

guid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
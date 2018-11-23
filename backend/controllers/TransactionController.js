const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// borrow and return records.
// Make sure only admins get transactions.
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const transactionMapper = require('../mappers/TransactionMapper').getInstance();
const Transaction = require('../business_objects/Transaction').Transaction;
const cartItemMapper = require('../mappers/CartItemMapper').getInstance();
const bookMapper = require('../mappers/BookMapper').getInstance();
const magazineMapper = require('../mappers/MagazineMapper').getInstance();
const musicMapper = require('../mappers/MusicMapper').getInstance();
const movieMapper = require('../mappers/MovieMapper').getInstance();
const getNumBorrowsRemaining = require('../controllers/CartItemController').getNumBorrowsRemaining;

const maxBorrows = 5;
exports.maxBorrows = maxBorrows;

class TransactionController {
    constructor() {
        this.mapper = transactionMapper;
        this.recordName = 'transaction';
        this.identifier = 'transactionId';
        this.recordType = Transaction;
        this.getTransactions = this.getTransactions.bind(this);
        this.borrowRecord = this.borrowRecord.bind(this);
        this.returnRecord = this.returnRecord.bind(this);
        this.cartItemMapper = cartItemMapper;
        
    }

    async getTransactions(req, res) 
    {
        identifyUser(req.body.authToken)
        .then(async user => 
        {
			await this.mapper.get(req.body.filters)
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
    
    async borrowRecord (req, res) 
    {
        console.log('borrow record');
        identifyUser(req.body.authToken)
        .then(async user => 
        {
            for (var index in req.body.cart) {
                var cartItem = req.body.cart[index];

                console.log('cart item: ' + JSON.stringify(cartItem));
                // Users only
                if (user.is_admin)
                {
                    handleException(res, Exceptions.Unauthorized);
                    return;
                }
    
                // Make sure user hasn't reached max borrows
                var numBorrowsRemaining = await getNumBorrowsRemaining(user);
                if (numBorrowsRemaining <= 0) {
                    handleException(res, Exceptions.BadRequest);
                    return;
                }
               
                console.log('made it here');
                // check for item availability
                var available = 0;
                var catalogueMapper = selectCatalogueMapper(cartItem.mediaType);
    
                var mediaTypeKey = getMediaTypeKey(cartItem.mediaType);
                
    
                var filter = {};
                filter[mediaTypeKey] = cartItem.mediaId;
                await catalogueMapper.get(filter)
                .then(records => {
                    if (records != undefined && records.length != undefined &&  records.length > 0) {
                        available = records[0].numAvailable; // there should be at most 1 record because cartItem.mediaId is a unique identifier
                    }
                })
                .catch(ex => {
                    handleException(res, ex);
                    return;
                })
                
                if (available <= 0) {
                    handleException(res, Exceptions.BadRequest);
                    return;
                }
    
    
                // Given that there are copies that can be loaned,
                // the transaction is done and added to the system
    
                var props = {transactionId: guid(), userId: user.id, transactionType: 0, isReturned: 0, mediaId: cartItem.mediaId, mediaType: cartItem.mediaType};
                await transactionMapper.add(new Transaction(props))
                .then(record => {
                    
                })
                .catch(ex => {
                    handleException(res, ex);
                })
    
                var updatedRecord;
                await catalogueMapper.modify(filter, {numAvailable: available - 1})
                .then(records => {
                    updatedRecord = records[0]; // There should be exactly 1 updated record because transactionId i
                })
                .catch(ex => {
                    handleException(res, ex);
                    return;
                })
    
    
                if (updatedRecord === undefined) {
                    handleException(res, Exceptions.InternalServerError);
                    return;
                }
    
                
                //Remove existing cart items after processing borrow requests
                var filters = {userId: user.id, mediaType: cartItem.mediaType, mediaId: cartItem.mediaId};
                await cartItemMapper.remove(filters)
                .then(removedRecords => {
                    if (removedRecords.length === 0) {
                        handleException(res, Exceptions.BadRequest);
                    }
                })
                .catch(ex => {
                    handleException(res, ex);
                });

                res.status(200);
                res.send();
            }

            res.status(400);
            res.send();
        })
				
        .catch(ex => 
        {
            handleException(res, ex);
        });
    }
    
    async returnRecord (req, res)
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

            // Update the borrow transaction if it exists
            var updatedTransactions;


            var transactionId = req.body.returnItems[0].transactionId;


            var filters = {userId: user.id, transactionId};
            try {
                await transactionMapper.modify(filters, {isReturned: 1})
                .then(result => {
                    updatedTransactions = result;
                })
                .catch(ex => {
                    handleException(res, ex);
                    return;
                });
            }
            catch (e) {
                console.log('exception: ' + e);
            }
            if (updatedTransactions === undefined || updatedTransactions.length !== 1) {
                console.log('updatedTranction is undefined or does not have length 1');
                handleException(res, Exceptions.BadRequest);
                return;
            }
            var updatedTransaction = updatedTransactions[0];

            var mediaTypeKey = getMediaTypeKey(updatedTransaction.mediaType);

            // get corresponding catalogueItem
            var catalogueMapper = selectCatalogueMapper(updatedTransaction.mediaType);
            var catalogueItems;
            var filter = {};
            filter[mediaTypeKey] = updatedTransaction.mediaId;
            await catalogueMapper.get(filter)
            .then(result => {
                catalogueItems = result;
            })
            .catch(ex => 
            {
                handleException(res, ex);
                return;
            });

            if (catalogueItems === undefined || catalogueItems.length !== 1) {
                console.log('catalogueItems is undefined or does not have length 1');
                handleException(res, Exceptions.InternalServerError);
                return;
            }
            var catalogueItem = catalogueItems[0];

            // update numAvailable of catalogueItem
            var updatedCatalogueItems;
            await catalogueMapper.modify(filter, {numAvailable: catalogueItem.numAvailable + 1})
            .then(result => {
                updatedCatalogueItems = result;
            })
            .catch(ex => 
            {
                handleException(res, ex);
                return;
            });
            if (updatedCatalogueItems === undefined || updatedCatalogueItems.length !== 1) {
                console.log('updatedCatalogueItems is undefined or does not have length 1');
                handleException(res, Exceptions.InternalServerError);
                return;
            }
            
            // add return transaction
            var props = {transactionId: guid(), userId: user.id, transactionType: 1, isReturned: 1, mediaId: updatedTransaction.mediaId, mediaType: updatedTransaction.mediaType};
            await transactionMapper.add(new Transaction(props))
            .then(record => {
                
            })
            
            res.status(200);
            res.send();
        })
        .catch(ex => 
        {
            handleException(res, ex);
            return;
        });
    }
}

const instance = new TransactionController();
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

selectCatalogueMapper = (mediaType) => {
    var mediaType = mediaType.toLowerCase();
    switch(mediaType) {
        case 'book':
            return bookMapper;
        case 'magazine':
            return magazineMapper;
        case 'music':
            return musicMapper;
        case 'movie':
            return movieMapper;
        default:
            throw 'Invalid media type';
    }
}

getMediaTypeKey = (mediaType) => {
    switch(mediaType) {
        case 'book':
        case 'magazine':
            return 'isbn13';
        case 'music':
            return 'asin';
        case 'movie':
            return 'eidr';
    }
}

s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

guid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
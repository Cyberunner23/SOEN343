const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// borrow and return records.
// Make sure only admins get transactions.
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const transactionMapper = require('../mappers/TransactionMapper').getInstance();
const Transaction = require('../business_objects/Transaction').Transaction;
const cartItemMapper = require('../mappers/CartItemMapper').CartItemMapper;
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
            console.log('filters: ' + JSON.stringify(req.body.filters));
			await this.mapper.get(req.body.filters)
			.then(records => {
				res.status(200);
                res.json(records);
                console.log('returning: ' + JSON.stringify(records));
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
        identifyUser(req.body.authToken)
        .then(async user => 
        {
            // Users only
            if (user.is_admin)
            {
                console.log('Only users can borrow catalogue items');
                handleException(res, Exceptions.Unauthorized);
                return;
            }

            // Make sure user hasn't reached max borrows
            var numBorrowsRemaining = await getNumBorrowsRemaining(user);
            if (numBorrowsRemaining <= 0) {
                console.log('Cannot borrow because user has reached borrow limit');
                handleException(res, Exceptions.BadRequest);
                return;
            }
           
            // check for item availability
            var available = 0;
            var catalogueMapper = selectCatalogueMapper(req.body.mediaType);
			await catalogueMapper.get({identifier: req.body.mediaId})
			.then(records => {
                if (records != undefined && records.length != undefined &&  records.length > 0) {
                    available = records[0].numAvailable; // there should be at most 1 record because req.body.mediaId is a unique identifier
                }
			})
			.catch(ex => {
				handleException(res, ex);
            })
            
			if (available <= 0) {
                console.log('Cannot borrow because item is out of stock');
                handleException(res, Exceptions.BadRequest);
                return;
            }

            // Given that there are copies that can be loaned,
            // the transaction is done and added to the system

            var props = {userId: user.id, transactionType: 'borrow', isReturned: 0, mediaId: req.body.mediaId, mediaType: req.body.mediaType};
            await transactionMapper.add(new Transaction(props))
            .then(record => {
                
            })
            .catch(ex => {
                console.log('Failed to add borrow transaction');
                handleException(res, ex);
            })

            var updatedRecord;
            await catalogueMapper.update({identifier: req.body.mediaId}, {numAvailable: available - 1})
            .then(records => {
                updatedRecord = records[0]; // There should be exactly 1 updated record because transactionId i
            })
            .catch(ex => {
                console.log('Failed to update catalogue item');
                handleException(res, ex);
                return;
            })

            if (updatedRecord === undefined) {
                console.log('updatedRecord is undefined');
                handleException(res, Exceptions.InternalServerError);
                return;
            }
			
			//Remove existing cart items after processing borrow requests
            var filters = {mediaType: req.body.mediaType, mediaId: req.body.mediaType};
            await this.cartItemMapper.remove(filters)
            .then(removedRecords => {
                if (removedRecords.length === 0) {
                    console.log('No cartItems were removed');
                    handleException(res, Exceptions.BadRequest);
                }
            })
            .catch(ex => {
                handleException(res, ex);
            });
            
            res.status(200);
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
                console.log('Only clients can return library items');
                handleException(res, Exceptions.Unauthorized);
                return;
            }

            // Update the borrow transaction if it exists
            updatedTransactions;
            await transactionMapper.modify({userId: user.id, transactionId: req.body.transactionId}, {isReturned: 1})
            .then(result => {
                updatedTransactions = result;
            })
            .catch(ex => 
            {
                handleException(res, ex);
                return;
            });
            if (updatedTransactions === undefined || updatedTransactions.length !== 1) {
                console.log('updatedTranction is undefined or does not have length 1');
                handleException(res, Exceptions.BadRequest);
                return;
            }
            var updatedTransaction = updatedTransactions[0];

            // get corresponding catalogueItem
            var catalogueMapper = selectCatalogueMapper(updatedTransaction.mediaType);
            var catalogueItems;
            await catalogueMapper.get({identifier: updatedTransaction.mediaId})
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
            await catalogueMapper.update({identifier: catalogueItem.identifier}, {numAvailable: catalogueItem.numAvailable + 1})
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
            var props = {userId: user.id, transactionType: 'return', isReturned: 1, mediaId: req.body.mediaId, mediaType: req.body.mediaType};
            await transactionMapper.add(new Transaction(props));
            
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
    mediaType = mediaType.toLower();
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

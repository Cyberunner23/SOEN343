const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// borrow and return records.
// Make sure only admins get transactions.
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const transactionMapper = require('../mappers/TransactionMapper').getInstance();
const Transaction = require('../business_objects/Transaction').Transaction;
const cartItemMapper = require('../mappers/CartItemMapper').CartItemMapper;
const genericMapper = require('../mappers/GenericMapper').GenericMapper;

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
		this.genericMapper = genericMapper;
    }

    async getTransactions(req, res) 
    {
        identifyUser(req.body.authToken)
        .then(async user => 
        {
			//Admins only
            if (!user.is_admin)
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
    
    async borrowRecord (req, res) 
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
           
			//This grabs the numAvailable count from a media item. 
			//	Set to 0 by default as a fallback case
			var available = 0;
			var filter = {recordType: mediaType, identifier: mediaId};
			//Not entirely sure if my use of genericMapper is correct here, please advise
			await this.genericMapper.get(filter)
			.then(record => {
				available = record.numAvailable;
			})
			.catch(ex => {
				handleException(res, ex);
			})
			
			if(available > 0) {	
				//Given that there are copies that can be loaned,
				//	the transaction is done and added to the system
				this.mapper.add(new this.Transaction(req.body))
				.then(record => {
					res.status(200);
					res.json(record);
				})
				.catch(ex => {
					handleException(res, ex);
				})
				
				//Now numAvailable must be decremented 
				available = available-1;
				//Not entirely sure if my use of genericMapper is correct here, please advise
				this.genericMapper.modify(filter, numAvailable: available)
				.then(updatedRecords => {
					if (updatedRecords.length === 0) {
						handleException(res, Exceptions.BadRequest);
					}
					else {
						res.status(200);
						res.json(updatedRecords[0]); // There should be only 1 record because the filter is a unique identifier
					}
				})						
			}
			else{
				handleException(res, Exceptions.BadRequest);
				//Unsure if this is the best way to handle this error case
			}
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

            // req.body.recordId
        })
        .catch(ex => 
        {
            handleException(res, ex);
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

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
			
			//Remove existing cart items after processing borrow requests
            var filters = {userId: userId, mediaId: mediaId, mediaType: mediaType};
            this.cartItemMapper.remove(filters)
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

			//This grabs the numAvailable count from a media item, to increment it 
			var available;
			var filter = {recordType: mediaType, identifier: mediaId};
			//Not entirely sure if my use of genericMapper is correct here, please advise
			await this.genericMapper.get(filter)
			.then(record => {
				available = record.numAvailable;
			})
			.catch(ex => {
				handleException(res, ex);
			})
			available = available+1;
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
			
			//Modify oldest existing borrow record to be set as returned
			//First find the oldest borrow record's id			
			var idToChange; //This will be the transactionId of the oldest active borrow
			var timeOfId; //Contains the timestamp of transactionId to be changed
			var filter2 = {transactionType:0 isReturned: 0 userId: userId, mediaId: mediaId};
			await this.mapper.get(filter2)
			.then(values => {
				idToChange = values[0].transactionId;
				timeOfId = values[0].transactionTime;
				//This for loop compares the parsed values of each timestamp;
				//	the smallest, aka. oldest, one is desired
				//Starting with the first grabbed id, each one is compared in a loop
				for (int i = 0, i< (values.length-1), i++){
					if (Date.parse(timeOfId) > Date.parse(values[i+1].transactionTime)) {
						idToChange = values[i+1].transactionId;
						timeOfId = values[i+1].transactionTime;
					}
				}
			})			
			.catch(ex => {
				handleException(res, ex);
			})
			
			//Now that the transactionId has been found, set isReturned to 1
			filter2 = {transactionId: idToChange} //Set the filter to find the desired id
			this.mapper.modify(filter2, isReturned: 1)
			.then(updatedRecords => {
				if (updatedRecords.length === 0) {
					handleException(res, Exceptions.BadRequest);
				}
				else {
					res.status(200);
					res.json(updatedRecords[0]); // There should be only 1 record because the filter is a unique identifier
				}
			})		
			.catch(ex => {
				handleException(res, ex);
			})

			//Adding a new return transaction to the db
			this.mapper.add(new this.Transaction(req.body))
			.then(record => {
				res.status(200);
				res.json(record);
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

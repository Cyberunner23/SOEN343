const Transaction = require('../business_objects/Transaction').Transaction;
const masterGateway = require('./MasterGateway').getInstance();

class TransactionGateway {
    
    async get(jsonFilters){
        return masterGateway.get('transactions', jsonFilters);
    }

    add(jsonTransaction){
        masterGateway.add('transactions', new Transaction(jsonTransaction));
    }

    update(jsonTransaction){
        masterGateway.update('transactions', new Transaction(jsonTransaction), 'transactionId');
    }

    delete(idsToDelete){
        masterGateway.delete('transactions', 'transactionId', idsToDelete);
    }
}

const instance = new TransactionGateway();
exports.getInstance = () => {
    return instance;
}
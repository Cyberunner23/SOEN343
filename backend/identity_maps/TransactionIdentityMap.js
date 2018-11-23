const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class TransactionIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'transactionId';
    }
}

const instance = new TransactionIdentityMap();
exports.getInstance = () => {
    return instance;
}
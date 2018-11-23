const GenericMapper = require('./GenericMapper').GenericMapper;
const transactionIdentityMap = require('../identity_maps/TransactionIdentityMap').getInstance();
const transactionGateway = require('../gateways/TransactionGateway').getInstance();

class TransactionMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'transactionId';
        this.identityMap = transactionIdentityMap;
        this.gateway = transactionGateway;
    }
}

const instance = new TransactionMapper();
exports.getInstance = () => {
    return instance;
}
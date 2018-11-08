const GenericIdentityMap = require('./GenericIdentityMap').GenericIdentityMap;

class ReservationIdentityMap extends GenericIdentityMap {
    constructor () {
        super();
        this.identifier = 'id';
    }
}

const instance = new ReservationIdentityMap();
exports.getInstance = () => {
    return instance;
}
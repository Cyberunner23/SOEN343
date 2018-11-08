const GenericMapper = require('./GenericMapper').GenericMapper;
const reservationIdentityMap = require('../identity_maps/ReservationIdentityMap').getInstance();
const reservationGateway = require('../gateways/ReservationGateway').getInstance();

class ReservationMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'id';
        this.identityMap = reservationIdentityMap;
        this.gateway = reservationGateway;
    }
}

const instance = new ReservationMapper();
exports.getInstance = () => {
    return instance;
}
const GenericMapper = require('./GenericMapper').GenericMapper;
const movieIdentityMap = require('../identity_maps/MovieIdentityMap').getInstance();
const movieGateway = require('../gateways/MovieGateway').getInstance();

class MovieMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'eidr';
        this.identityMap = movieIdentityMap;
        this.gateway = movieGateway;
    }
}

const instance = new MovieMapper();
exports.getInstance = () => {
    return instance;
}
const GenericMapper = require('./GenericMapper').GenericMapper;
const magazineIdentityMap = require('../identity_maps/MagazineIdentityMap').getInstance();
const magazineGateway = require('../gateways/MagazineGateway').getInstance();

class MagazineMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'isbn13';
        this.identityMap = magazineIdentityMap;
        this.gateway = magazineGateway;
        this.initialize();
    }
}

const instance = new MagazineMapper();
exports.getInstance = () => {
    return instance;
}
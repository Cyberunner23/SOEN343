const GenericMapper = require('./GenericMapper').GenericMapper;
const musicIdentityMap = require('../identity_maps/MusicIdentityMap').getInstance();
const musicGateway = require('../gateways/MusicGateway').getInstance();

class MusicMapper extends GenericMapper {
    
    constructor () {
        super()
        this.identifier = 'asin';
        this.identityMap = musicIdentityMap;
        this.gateway = musicGateway;
    }
}

const instance = new MusicMapper();
exports.getInstance = () => {
    return instance;
}
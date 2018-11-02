const Music = require('../business_objects/Music').Music;
const genericGateway = require('./GenericGatewayMethods');

class MusicGateway {
    
    async getMusics(jsonFilters){
        return genericGateway.get('musics', jsonFilters);
    }

    async addMusic(jsonMusic){
        return genericGateway.add('musics', jsonMusic);
    }

    async updateMusic(jsonMusic){
        return genericGateway.update('musics', new Music(jsonMusic), 'asin');
    }

    async deleteMusics(asinsToDelete){
        return genericGateway.delete('musics', 'asin', asinsToDelete);
    }
}

const instance = new MusicGateway();
exports.getInstance = () => {
    return instance;
}
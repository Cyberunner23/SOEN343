const Music = require('../business_objects/Music').Music;
const masterGateway = require('./MasterGateway').getInstance();

class MusicGateway {
    
    async getMusics(jsonFilters){
        return masterGateway.get('musics', jsonFilters);
    }

    async addMusic(jsonMusic){
        return masterGateway.add('musics', jsonMusic);
    }

    async updateMusic(jsonMusic){
        return masterGateway.update('musics', new Music(jsonMusic), 'asin');
    }

    async deleteMusics(asinsToDelete){
        return masterGateway.delete('musics', 'asin', asinsToDelete);
    }
}

const instance = new MusicGateway();
exports.getInstance = () => {
    return instance;
}
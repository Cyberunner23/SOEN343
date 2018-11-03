const Music = require('../business_objects/Music').Music;
const masterGateway = require('./MasterGateway').getInstance();

class MusicGateway {
    
    async get(jsonFilters){
        return masterGateway.get('musics', jsonFilters);
    }

    add(jsonMusic){
        masterGateway.add('musics', new Music(jsonMusic));
    }

    update(jsonMusic){
        masterGateway.update('musics', new Music(jsonMusic), 'asin');
    }

    delete(asinsToDelete){
        masterGateway.delete('musics', 'asin', asinsToDelete);
    }
}

const instance = new MusicGateway();
exports.getInstance = () => {
    return instance;
}
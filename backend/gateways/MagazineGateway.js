const Magazine = require('../business_objects/Magazine').Magazine;
const masterGateway = require('./MasterGateway').getInstance();

class MagazineGateway {
    
    async get(jsonFilters){
        return masterGateway.get('magazines', jsonFilters);
    }

    add(jsonMagazine){
        masterGateway.add('magazines', new Magazine(jsonMagazine));
    }

    update(jsonMagazine){
        masterGateway.update('magazines', new Magazine(jsonMagazine), 'isbn13');
    }

    delete(isbn13sToDelete){
        masterGateway.delete('magazines', 'isbn13', isbn13sToDelete);
    }
}

const instance = new MagazineGateway();
exports.getInstance = () => {
    return instance;
}
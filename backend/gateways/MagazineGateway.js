const Magazine = require('../business_objects/Magazine').Magazine;
const masterGateway = require('./MasterGateway').getInstance();

class MagazineGateway {
    
    async getMagazines(jsonFilters){
        return masterGateway.get('magazines', jsonFilters);
    }

    async addMagazine(jsonMagazine){
        return masterGateway.add('magazines', jsonMagazine);
    }

    async updateMagazine(jsonMagazine){
        return masterGateway.update('magazines', new Magazine(jsonMagazine), 'isbn13');
    }

    async deleteMagazines(isbn13sToDelete){
        return masterGateway.delete('magazines', 'isbn13', isbn13sToDelete);
    }
}

const instance = new MagazineGateway();
exports.getInstance = () => {
    return instance;
}
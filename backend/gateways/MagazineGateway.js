const Magazine = require('../business_objects/Magazine').Magazine;
const genericGateway = require('./GenericGatewayMethods');

class MagazineGateway {
    
    async getMagazines(jsonFilters){
        return genericGateway.get('magazines', jsonFilters);
    }

    async addMagazine(jsonMagazine){
        return genericGateway.add('magazines', jsonMagazine);
    }

    async updateMagazine(jsonMagazine){
        return genericGateway.update('magazines', new Magazine(jsonMagazine), 'isbn13');
    }

    async deleteMagazines(isbn13sToDelete){
        return genericGateway.delete('magazines', 'isbn13', isbn13sToDelete);
    }
}

const instance = new MagazineGateway();
exports.getInstance = () => {
    return instance;
}
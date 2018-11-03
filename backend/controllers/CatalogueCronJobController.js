const masterGateway = require('../gateways/MasterGateway').getInstance();

persistChangesToDatabase = () => {
    setInterval(() => {
        masterGateway.executeTransaction()
        .catch(exception => {
            console.log('Something went wrong when attempting to persist catalogue changes to the database');
        })
    }, 10000)
}

class CatalogueCronJobController {
    constructor() {
        persistChangesToDatabase();
    }
}

const instance = new CatalogueCronJobController();
exports.getInstance = () => {
    return instance;
}
const masterGateway = require('../gateways/MasterGateway').getInstance();

const bookMapper = require('../mappers/BookMapper').getInstance();
const magazineMapper = require('../mappers/MagazineMapper').getInstance();
const musicMapper = require('../mappers/MusicMapper').getInstance();
const movieMapper = require('../mappers/MovieMapper').getInstance();
const transactionMapper = require('../mappers/TransactionMapper').getInstance();
const cartItemMapper = require('../mappers/CartItemMapper').getInstance();

persistChangesToDatabase = () => {
    setInterval(() => {
        masterGateway.createTransaction();

        bookMapper.sendChangesToGateway();
        magazineMapper.sendChangesToGateway();
        musicMapper.sendChangesToGateway();
        movieMapper.sendChangesToGateway();
        transactionMapper.sendChangesToGateway();
        cartItemMapper.sendChangesToGateway();

        masterGateway.executeTransaction()
        .catch(exception => {
            console.log('Something went wrong when attempting to persist catalogue changes to the database');
        })
    }, 30000)
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
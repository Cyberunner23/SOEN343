const identifyUser = require('./UserController').identifyUser;
// wrap each method body with identify user to make sure only clients
// addToCart, RemoveFromCart, RentRecord and ReturnRecord.
// Make sure only admins viewReservations.
// See GenericCatalogueController for how to use identifyUser
const Exceptions = require('../Exceptions').Exceptions;
const reservationMapper = require('../mappers/ReservationMapper').getInstance();
const Reservation = require('../business_objects/Reservation').Reservation;

exports.ReservationController = class ReservationController {
    constructor() {
        this.mapper = reservationMapper;
        this.recordName = 'reservation';
        this.identifier = 'id';
        this.recordType = Reservation;
        this.getReservations = this.getReservations.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.rentRecord = this.rentRecord.bind(this);
        this.returnRecord = this.returnRecord.bind(this);
    }

    async getReservations(req, res) {



    }

    async addToCart(req, res) {
        

        
    }
    
    async removeFromCart(req, res) {
        

        
    }
    
    async rentRecord (req, res) {
        


    }
    
    async returnRecord (req, res) {
        


    }
}

const instance = new ReservationController();
exports.getInstance = () => {
    return instance;
}

handleException = function(res, exception) {
    var message;
    switch(exception){
        case Exceptions.BadRequest:
            message = "BadRequest";
            res.status(400);
            break;
        case Exceptions.Unauthorized:
            message = "Unauthorized";
            res.status(401);
            break;
        case Exceptions.InternalServerError:
        default:
            message = "InternalServerError";
            res.status(500);
            break;
    }
    res.json({err: message});
}
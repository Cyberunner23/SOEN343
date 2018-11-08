const Reservation = require('../business_objects/Reservation').Reservation;
const masterGateway = require('./MasterGateway').getInstance();

class ReservationGateway {
    
    async get(jsonFilters){
        return masterGateway.get('reservations', jsonFilters);
    }

    add(jsonReservation){
        masterGateway.add('reservations', new Reservation(jsonReservation));
    }

    update(jsonReservation){
        masterGateway.update('reservations', new Reservation(jsonReservation), 'id');
    }

    delete(idsToDelete){
        masterGateway.delete('reservations', 'id', idsToDelete);
    }
}

const instance = new ReservationGateway();
exports.getInstance = () => {
    return instance;
}
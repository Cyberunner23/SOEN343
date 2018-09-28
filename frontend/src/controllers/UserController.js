import Administrator from '../components/users/administrator.js';
import Client from '../components/users/client.js';

export default class UserController {

    authenticate = function (email, password) {
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email, password)
        }).then(function (response) {
            if (response.status != 200) {
                return null;
            } else if (response.hasOwnProperty('client')) {
                return new Client(response.id, response.email, response.firstName, response.lastName, response.phone, response.address);
            } else if (response.hasOwnProperty('admin')) {
                return new Administrator(response.id, response.email, response.firstName, response.lastName, response.phone, response.address);
            } else {
                return null;
            }
        });
    }

    static createClient = function (email, password, firstName, lastName, phone, address) {
        fetch('/api/users/registerClient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password, firstName: firstName, lastName: lastName, phone: phone, address: address})
        }).then(function (response) {
            if (response.status == 200) {
                return new Administrator(response.id, response.email, response.firstName, response.lastName, response.phone, response.address);
            }
        });
    }

    createAdmin = function (id, authToken, email, password, firstName, LastName, phone, address) {
        fetch('/api/users/registerAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id, authToken, email, password, firstName, LastName, phone, address)
        });
    }

    logout = function (id) {
        fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id)
        });
    }
}
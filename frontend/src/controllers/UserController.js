import Administrator from '../components/users/administrator.js';
import Client from '../components/users/client.js';

export default class UserController {

    static authenticate = async function (EMail, Password) {
        return new Promise((resolve, reject) => {
            fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({EMail, Password})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((user) => {
                        if (user.IsAdmin) {
                            resolve({IsAdmin: true, user: new Administrator(user.id, user.EMail, user.FirstName, user.LastName, user.Phone, user.Address)});
                        } else {
                            resolve({IsAdmin: false, user: new Client(user.id, user.EMail, user.FirstName, user.LastName, user.Phone, user.Address)});
                        }
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
    }

    static createClient = async function (EMail, Password, FirstName, LastName, Phone, Address) {
        return new Promise((resolve, reject) => {
            fetch('/api/users/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({IsAdmin: false, EMail, Password, FirstName, LastName, Phone, Address})
            }).then((response) => {
                if (response.status === 200) {
                    resolve(new Client(EMail, Password, FirstName, LastName, Phone, Address));
                }
                else {
                    resolve(null);
                }
            });

        })
    }

    static createAdmin = async function (EMail, Password, FirstName, LastName, Phone, Address) {
        return new Promise((resolve, reject) => {
            fetch('/api/users/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({IsAdmin: true, EMail, Password, FirstName, LastName, Phone, Address})
            }).then((response) => {
                if (response.status === 200) {
                    resolve(new Administrator(response.id, EMail, Password, FirstName, LastName, Phone, Address));
                }
                else {
                    resolve(null);
                }
            });

        })
    }

    logout = function (id) {
        fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id)
        });
    }
}
import React, { Component } from 'react';
import './Register.css'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_admin: props.is_admin,
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            phone: '',
            address: '',
            app: props.app,
            registrationSubmitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, registrationSubmitted: false});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.registerUser(this.state)
        .then(user => {
            var message;
            if (this.state.is_admin) {
                console.log('Admin created successfully');
                message = 'New admin ' + user.first_name + ' created';
            }
            else {
                console.log('Client created successfully');
                message = 'New client ' + user.first_name + ' created';
            }
            this.setState({registrationSubmitted: true, registrationSubmittedMessage: message});
        })
        .catch(message => {
            this.setState({registrationSubmitted: true, registrationSubmittedMessage: message});
        })
    }

    render() {
        var registrationSubmittedMessage;
        if (this.state.registrationSubmitted) {
            registrationSubmittedMessage = (
                <div>{this.state.registrationSubmittedMessage}</div>
            )
        }
        var header;
        if (this.state.is_admin) {
            header = <h1>Register New Administrator</h1>
        }
        else {
            header = <h1>Register New User</h1>
        }
        return (
            <div className='UseCaseComponent'>
                {header}
                <form onSubmit={this.handleSubmit} method="POST">
                    <label>
                        EMail:
                        <input type="text" name="email" onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={this.handleChange} />
                    </label>
                    <label>
                        First Name:
                        <input type="text" name="first_name" onChange={this.handleChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="last_name" onChange={this.handleChange} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" name="phone" onChange={this.handleChange} />
                    </label>
                    <label>
                        Address:
                        <input type="text" name="address" onChange={this.handleChange} />
                    </label>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
                {registrationSubmittedMessage}
            </div>
        );
    }

    async registerUser (props) {
        let is_admin = props.is_admin;
        let email = props.email;
        let password = props.password;
        let first_name = props.first_name;
        let last_name = props.last_name;
        let phone = props.phone;
        let address = props.address;
        let authToken = this.state.app.state.currentUser.authToken;

        return new Promise((resolve, reject) => {
            fetch('/api/users/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({is_admin, email, password, first_name, last_name, phone, address, authToken})
            }).then((response) => {
                var status = response.status;
                response.json()
                .then(json => {
                    if (status === 200) {
                        resolve(json); // user json
                    }
                    else {
                        reject(json.err);
                    }
                })
            });
        })
    }
} 
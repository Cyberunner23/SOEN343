import React, { Component } from 'react';
import { TabsState } from '../TabsFactory/TabsFactory.js'
import './Register.css'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_admin: props.is_admin,
            email: '',
            password: '',
            salt: 'soen343',
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
        var data = {
            is_admin: this.state.is_admin || false,
            email: this.state.email,
            password: this.state.password,
            salt: this.state.salt,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            phone: this.state.phone,
            address: this.state.address
        };
        if (data.is_admin) {
            this.registerUser(data.is_admin, data.email, data.password, data.first_name, data.last_name, data.phone, data.address).then((user) => {
                if (user !== null) {
                    console.log('Admin created successfully');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'New admin ' + data.first_name + ' created'})
                } else {
                    console.log('email already used');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'email already used'})
                }
            })
        } else {
            this.registerUser(data.is_admin, data.email, data.password, data.first_name, data.last_name, data.phone, data.address).then((user) => {
                if (user !== null) {
                    console.log('Client created successfully');
                    this.state.app.setCurrentUser(user);
                    this.state.app.setTabsState(TabsState.Client);
                } else {
                    console.log('email already used');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'email already used'})
                }
            })
        }
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
            header = <h1>Register</h1>
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

    async registerUser (is_admin, email, password, first_name, last_name, phone, address) {
        return new Promise((resolve, reject) => {
            fetch('/api/users/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({is_admin, email, password, first_name, last_name, phone, address})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((user) => {
                        resolve(user);
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
    }
} 
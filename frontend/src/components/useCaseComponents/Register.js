import React, { Component } from 'react';
import { TabsState } from '../TabsFactory/TabsFactory.js'
import UserController from '../../controllers/UserController.js';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: props.isAdmin,
            email: '',
            password: '',
            salt: 'soen343',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            app: props.app,
            registrationComplete: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, registrationComplete: false });
    }
    handleSubmit(event) {
        console.log("hit!");
        event.preventDefault();
        var data = {
            isAdmin: this.state.isAdmin,
            email: this.state.email,
            password: this.state.password,
            salt: this.state.salt,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            address: this.state.address
        };
        console.log(data);
        UserController.createClient(data.email, data.password, data.firstName, data.lastName, data.phone, data.address);
    }
    render() {
        var registrationCompleteMessage;
        if (this.state.isAdmin && this.state.registrationComplete) {
            registrationCompleteMessage = (
                <div>Registration complete for {this.state.firstName}</div>
            )
        }
        var header;
        if (this.state.isAdmin) {
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
                        Email:
                        <input type="text" name="email" onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={this.handleChange} />
                    </label>
                    <label>
                        First Name:
                        <input type="text" name="firstName" onChange={this.handleChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" onChange={this.handleChange} />
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
                {registrationCompleteMessage}
            </div>
        );
    }
} 
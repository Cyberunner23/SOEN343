import React, { Component } from 'react';
import { TabsState } from '../TabsFactory/TabsFactory.js'
import UserController from '../../controllers/UserController.js';
import './Register.css'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsAdmin: props.IsAdmin,
            EMail: '',
            Password: '',
            salt: 'soen343',
            FirstName: '',
            LastName: '',
            Phone: '',
            Address: '',
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
            EMail: this.state.EMail,
            Password: this.state.Password,
            salt: this.state.salt,
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            Phone: this.state.Phone,
            Address: this.state.Address
        };
        if (this.state.IsAdmin) {
            UserController.createAdmin(data.EMail, data.Password, data.FirstName, data.LastName, data.Phone, data.Address).then((user) => {
                if (user !== null) {
                    console.log('Admin created successfully');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'New admin ' + data.FirstName + ' created'})
                } else {
                    console.log('Email already used');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'Email already used'})
                }
            })
        } else {
            UserController.createClient(data.EMail, data.Password, data.FirstName, data.LastName, data.Phone, data.Address).then((user) => {
                if (user !== null) {
                    console.log('Client created successfully');
                    this.state.app.setCurrentUser(user);
                    this.state.app.setTabsState(TabsState.Client);
                } else {
                    console.log('Email already used');
                    this.setState({registrationSubmitted: true, registrationSubmittedMessage: 'Email already used'})
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
        if (this.state.IsAdmin) {
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
                        <input type="text" name="EMail" onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="Password" onChange={this.handleChange} />
                    </label>
                    <label>
                        First Name:
                        <input type="text" name="FirstName" onChange={this.handleChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="LastName" onChange={this.handleChange} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" name="Phone" onChange={this.handleChange} />
                    </label>
                    <label>
                        Address:
                        <input type="text" name="Address" onChange={this.handleChange} />
                    </label>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
                {registrationSubmittedMessage}
            </div>
        );
    }
} 
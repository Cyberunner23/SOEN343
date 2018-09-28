import React, { Component } from 'react';
import './register.css';
import {TabsState} from '../TabsFactory/TabsFactory.js'

export class Register extends Component {

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
        this.setState({ [e.target.name]: e.target.value, registrationComplete: false});
    }

    handleSubmit(event) {
        event.preventDefault();
        var data = {
            IsAdmin: this.state.isAdmin,
            EMail: this.state.email,
            Password: this.state.password,
            Salt: this.state.salt,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Phone: this.state.phone,
            Address: this.state.address
        };
        fetch('/api/users/new', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(() => {
            if (this.state.isAdmin) {
                this.state.app.setTabsState(TabsState.Admin);
            } else {
                this.state.app.setTabsState(TabsState.Client);
            }
            this.setState({registrationComplete: true})
            console.log("Registration Completed");
        }).catch(function(err) {
            console.log(err)
        });
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
                    <input type="submit" value="Submit"/>
                </form>
                {registrationCompleteMessage}
            </div>
        );
    }
}
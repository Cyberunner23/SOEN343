import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {TabsState} from '../TabsFactory/TabsFactory.js'
import Administrator from '../users/administrator';
import Client from '../users/client';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EMail:'',
            Password:'',
            app: props.app,
            loginFailed: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, loginFailed: false });
    }

    async handleSubmit(event) {
        event.preventDefault();
        var data = {
            EMail: this.state.EMail,
            Password: this.state.Password
        };

        this.authenticate(data.EMail, data.Password).then((response) => {
            if (response !== null) {
                if (response.IsAdmin) {
                    this.state.app.setTabsState(TabsState.Admin);
                    console.log("Admin Login Completed");
                } else {
                    this.state.app.setTabsState(TabsState.Client);
                    console.log("Client Login Completed");
                }
                this.state.app.setCurrentUser(response.user);
            } else {
                console.log('invalid authentication');
                this.setState({loginFailed: true})
            }
        })
    }

    render() {
        var loginFailedMessage;
        if (this.state.loginFailed) {
            loginFailedMessage = (
                <div>Login failed</div>
            )
        }
        else {
            loginFailedMessage = null;
        }

        return (
            <div className = 'UseCaseComponent'>
                <form onSubmit={this.handleSubmit} method="POST">
                    <TextField
                        label="Email"
                        name="EMail"
                        placeholder="johndoe@gmail.com"
                        margin="normal"
                        variant="outlined"
                        onChange={this.handleChange}
                        />
                        <br/>
                    <TextField
                        type="password"
                        name="Password"
                        placeholder="Password"
                        margin="normal"
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    <br/>
                    <Input
                        type="submit"
                        style={style} 
                    >
                        Login
                    </Input>
                </form>
                {loginFailedMessage}
            </div>
        );
    }

    async authenticate(EMail, Password) {
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
    };
}
const style = {
 margin: 15,
};
export default Login;
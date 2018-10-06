import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {TabsState} from '../TabsFactory/TabsFactory.js'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:'',
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
            email: this.state.email,
            password: this.state.password
        };

        this.authenticate(data.email, data.password).then((response) => {
            if (response !== null) {
                this.state.app.setCurrentUser(response);
                if (response.is_admin) {
                    this.state.app.setTabsState(TabsState.Admin);
                    console.log("Admin Login Completed");
                } else {
                    this.state.app.setTabsState(TabsState.Client);
                    console.log("Client Login Completed");
                }
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
                        label="email"
                        name="email"
                        placeholder="johndoe@gmail.com"
                        margin="normal"
                        variant="outlined"
                        onChange={this.handleChange}
                        />
                        <br/>
                    <TextField
                        type="password"
                        name="password"
                        placeholder="password"
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

    async authenticate(email, password) {
        return new Promise((resolve, reject) => {
            fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password})
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
    };
}
const style = {
 margin: 15,
};
export default Login;
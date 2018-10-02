import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {TabsState} from '../TabsFactory/TabsFactory.js'
import UserController from '../../controllers/UserController.js';

class Login extends Component {
constructor(props){
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

    UserController.authenticate(data.EMail, data.Password).then((response) => {
        console.log('Response: ' + JSON.stringify(response));
        if (response !== null) {
            if (response.IsAdmin) {
                this.state.app.setTabsState(TabsState.Admin);
                console.log("Admin Login Completed");
            } else {
                this.state.app.setTabsState(TabsState.Client);
                console.log("Client Login Completed");
            }
            console.log('User: ' + JSON.stringify(response.user));
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
}
const style = {
 margin: 15,
};
export default Login;
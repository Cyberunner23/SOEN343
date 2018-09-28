import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {TabsState} from '../TabsFactory/TabsFactory.js';
import UserController from '../../controllers/UserController.js';
 class Login extends Component {
constructor(props){
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
  handleSubmit(event) {
      UserController.authenticate(this.state.email, this.state.password);
    // event.preventDefault();
    // var data = {
    //     EMail: this.state.email,
    //     Password: this.state.password
    // };
    // fetch('/api/users/login', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(data)
    // }).then(function(response) {
    //     if (response.status >= 400) {
    //         throw new Error("Bad response from server");
    //     }
    //     return response.json();
    // }).then(data => {
    //     if (data.length === 0) {
    //         this.setState({loginFailed: true});
    //         console.log("Invalid login credentials");
    //     }
    //     else {
    //         if (data[0].IsAdmin) {
    //             this.state.app.setTabsState(TabsState.Admin);
    //             console.log("Admin Login Completed");
    //         } else {
    //             this.state.app.setTabsState(TabsState.Client);
    //             console.log("Client Login Completed");
    //         }
    //         this.state.app.setCurrentUser(data[0]);
    //     }
    // }).catch(function(err) {
    //     console.log(err)
    // });
}
 render() {
    var loginFailedMessage;
    if (this.state.loginFailed) {
        loginFailedMessage = (
            <div>Login failed</div>
        )
    }
     return (
        <div className = 'UseCaseComponent'>
            <form onSubmit={this.handleSubmit} method="POST">
                <TextField
                    label="Email"
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
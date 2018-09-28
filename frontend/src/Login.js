import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

class Login extends Component {
constructor(props){
  super(props);
    this.state = {
        email:'',
        password:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
 }

handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
}

 handleSubmit(event) {
    event.preventDefault();
    var data = {
        EMail: this.state.email,
        Password: this.state.password
    };
    fetch('/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then(function(data) {
        if(data[0].IsAdmin == false) console.log("Client Login Completed");
        else console.log("Admin Login Completed");
    }).catch(function(err) {
        console.log(err)
    });
}

render() {
    return (
      <div>
          <div>
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
         </div>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;
import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends Component {
constructor(props){
  super(props);
    this.state={
        email:'',
        password:''
    }
 }

render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
           <TextField
             label="Email"
             placeholder="johndoe@gmail.com"
             margin="normal"
             />
           <br/>
             <TextField
               type="password"
               placeholder="Password"
               margin="normal"
               />
             <br/>
             <Button
             variant="outlined"
             style={style} 
             >
             Login
             </Button>
         </div>
         </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;
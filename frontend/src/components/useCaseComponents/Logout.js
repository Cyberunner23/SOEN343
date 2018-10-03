import React, { Component } from 'react';
import {TabsState} from '../TabsFactory/TabsFactory.js'

class Logout extends Component {

    constructor(props) {
        super();
        this.state = {
            app: props.app
        }
        this.doLogout = this.doLogout.bind(this);
    }

    render() { return (
        <div className = 'UseCaseComponent'>
            <h2>Are you sure you want to logout?</h2>
            <button onClick = {this.doLogout}>Yes</button>
        </div>
    )}

    doLogout() {
        this.state.app.setCurrentUser({});
        this.state.app.setTabsState(TabsState.Welcome);
        console.log('Logout successful');
    }
}

export default Logout;
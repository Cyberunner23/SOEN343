import React, { Component } from 'react';
import './App.css';
import {TabsState, TabsFactory} from './components/TabsFactory/TabsFactory.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tabs : TabsState.Welcome, // We can change this manually to see what our components look like until the login/logout code works
      title: 'Oops! Title not set',
      currentUser: {}
    }
    // do not call these methods in App.render() --> infinite loop
    this.setTabsState = this.setTabsState.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }


  render() {
    var tabs = TabsFactory.buildTabs(this.state.tabs, this);
    var title;
    if (this.state.tabs === TabsState.Welcome) {
      title = 'Welcome to SOEN 343';
    }
    else {
      title = 'Hello ' + this.state.currentUser.first_name;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{title}</h1>
        </header>
        {tabs}
      </div>
    );
  }

  setTabsState(newTabsState) {
    this.setState({tabs : newTabsState});
  }

  setCurrentUser(newUser) {
    this.setState({currentUser: newUser});
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import {TabsState, TabsFactory} from './components/TabsFactory/TabsFactory.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      tabs : TabsState.Admin // We can change this manually to see what our components look like until the login/logout code works
    }
  }

  render() {
    var tabs = TabsFactory.buildTabs(this.state.tabs, this);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to SOEN 343</h1>
        </header>
        {tabs}
      </div>
    );
  }

  setTabsState(newTabsState) {
    this.setState({tabs : newTabsState});
  }
}

export default App;

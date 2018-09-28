import React, { Component } from 'react';
import './App.css';
import {TabsState, TabsFactory} from './components/TabsFactory/TabsFactory.js';
import Login from './Login';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tabs : TabsState.Welcome
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
    this.state.tabsState = newTabsState;
  }
}

export default App;

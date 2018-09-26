import React, { Component } from 'react';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LoginView from './components/view/loginView';
import RegisterClientView from './components/view/registerClientView.js';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to SOEN 343</h1>
        </header>
        <Tabs>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>

          <TabPanel>
            <LoginView/>
          </TabPanel>
          <TabPanel>
            <RegisterClientView/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;

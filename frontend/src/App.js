import React, { Component } from 'react';
import './App.css';
<<<<<<< Updated upstream
import Tab from './components/tabBar/tab.js';
import TabBar from './components/tabBar/tabbar.js';
import View from './components/view/view.js';
=======
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LoginView from './components/view/loginView';
import RegisterClientView from './components/view/registerClientView.js';
>>>>>>> Stashed changes

class App extends Component {
  constructor() {
    super();

<<<<<<< Updated upstream
    // Bind callBacks
    this.setView = this.setView.bind(this);
    this.setTabBar = this.setTabBar.bind(this);

    // group callBacks
    var callBacks = {
      setView: this.setView,
      setTabBar: this.setTabBar
    }

    // initialize login view and tab
    var loginColor = 'lightblue';
    var loginComponent = 'Replace this with your login component';
    var loginView = <View color = {loginColor} component = {loginComponent} callBacks = {callBacks}/>;
    var loginTab = <Tab text = 'Login' color = {loginColor} view = {loginView} callBacks = {callBacks}/>

    // initialize register client view and tab
    var registerClientColor = 'lightgreen';
    var registerComponent = 'Replace this with your register component';
    var registerClientView = <View color = {registerClientColor} component = {registerComponent} callBacks = {callBacks}/>
    var registerClientTab = <Tab text = 'Register' color = {registerClientColor} view = {registerClientView} callBacks = {callBacks}/>;
    
    // group tabs
    var tabs = [loginTab, registerClientTab];
    
    // set initial app state
    this.state = {
      view: loginView,
      tabBar: <TabBar tabs = {tabs} color = 'grey'/>
    }
=======
>>>>>>> Stashed changes
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

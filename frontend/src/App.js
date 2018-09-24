import React, { Component } from 'react';
import './App.css';
import Tab from './components/tabBar/tab.js';
import TabBar from './components/tabBar/tabbar.js';
import LoginView from './components/view/loginView';
import RegisterClientView from './components/view/registerClientView.js';

class App extends Component {
  constructor() {
    super();

    // Bind callBacks
    this.setView = this.setView.bind(this);
    this.setTabBar = this.setTabBar.bind(this);

    // group callBacks
    var callBacks = {
      setView: this.setView,
      setTabBar: this.setTabBar
    }

    // initialize login view and tab
    var loginViewColor = 'lightblue';
    var loginView = <LoginView color = {loginViewColor} callBacks = {callBacks}/>;
    var loginTab = <Tab text = 'Login' color = {loginViewColor} view = {loginView} callBacks = {callBacks}/>

    // initialize register client view and tab
    var registerClientViewColor = 'lightgreen';
    var registerClientView = <RegisterClientView color = {registerClientViewColor} callBacks = {callBacks}/>
    var registerClientTab = <Tab text = 'Register' color = {registerClientViewColor} view = {registerClientView} callBacks = {callBacks}/>;
    
    // group tabs
    var tabs = [loginTab, registerClientTab];
    
    // set initial app state
    this.state = {
      view: loginView,
      tabBar: <TabBar tabs = {tabs} color = 'grey'/>
    }
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to SOEN 343</h1>
        </header>
        {this.state.tabBar}
        {this.state.view}
      </div>
    );
  }

  // tabs can use this method to set the app's view
  setView(newView)
  {
    this.setState({view: newView});
  }

  // views can use this method to set the app's tabbar. Example: tabbar changes after successul login.
  setTabBar(newTabBar)
  {
    this.setState({tabBar: newTabBar})
  }
}

export default App;

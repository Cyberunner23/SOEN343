import React, { Component } from 'react';
import './App.css';
import Tab from './components/tabBar/tab.js';
import TabBar from './components/tabBar/tabbar.js';
import View from './components/view/view.js';
import ActiveUsersComponent from './components/useCaseComponents/activeUsersComponent.js'

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

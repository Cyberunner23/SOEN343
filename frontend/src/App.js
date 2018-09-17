import React, { Component } from 'react';
import './App.css';
import Clients from './components/clientrecord/clients'; 

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to SOEN 343</h1>
        </header>
        <Clients/>
      </div>
    );
  }
}

export default App;

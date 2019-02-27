import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';


import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Users from './components/Users/Users';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Route exact path='/' component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/users" component={Users} />
      </div>
    );
  }
}

export default withRouter(App);

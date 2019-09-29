import React, {Fragment} from 'react';
import Navbar from './components/layout/Navbar';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import TransactionsState from './context/transactions/TransactionsState'
import AlertState from './context/alert/AlertState'

import Alerts from './components/layout/Alerts';
import Home from './components/pages/Home'
import Chain from './components/pages/Chain'

import './App.css';


const App = () => {
  return (
    <AlertState>
    <TransactionsState>
    <Router>
      <Fragment>
        <Navbar/>
        <dev className="container">
          <Alerts/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Chain" component={Chain}/>
          </Switch>
        </dev>
      </Fragment>
    </Router>
    </TransactionsState>
    </AlertState>
  );
}

export default App;

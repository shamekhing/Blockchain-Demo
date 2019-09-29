import React, {Fragment} from 'react';
import Navbar from './components/layout/Navbar';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import TransactionsState from './context/transactions/TransactionsState'

import Home from './components/pages/Home'
import Chain from './components/pages/Chain'

import './App.css';


const App = () => {
  return (
    <TransactionsState>
    <Router>
      <Fragment>
        <Navbar/>
        <dev className="container">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Chain" component={Chain}/>
          </Switch>
        </dev>
      </Fragment>
    </Router>
    </TransactionsState>
  );
}

export default App;

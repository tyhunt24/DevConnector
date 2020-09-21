import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import './App.css';
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
//redux
import {Provider} from "react-redux"
import store from "./store"

const App = () => {
  return (
    <Provider store={store}>
    <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
        </Switch>
      </section>
    </Fragment>
    </Router>
    </Provider>
  );
}

export default App;

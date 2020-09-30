import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import './App.css';
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard"
import CreateProfile from "./components/Profile-forms/CreateProfile"
import EditProfile from "./components/Profile-forms/EditProfile"
import PrivateRoute from "./components/routing/PrivateRoute"
//redux
import {Provider} from "react-redux"
import store from "./store"
import {loadUser} from "./actions/auth"
import setAuthToken from "./utils/setAuthToken"

//sets the token to always be running on the backend
if(localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser()); //? not really sure what this is doing
  }, []) 
  return (
    <Provider store={store}>
    <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
          <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
          <PrivateRoute exact path ="/create-profile" component={CreateProfile} />
          <PrivateRoute exact path ="/edit-profile" component={EditProfile} />
        </Switch>
      </section>
    </Fragment>
    </Router>
    </Provider>
  );
}

export default App;

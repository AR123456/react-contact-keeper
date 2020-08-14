import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
// bring in Register from the  auth components
import Register from "./components/auth/Register";
// bring in Login from the auth components
import Login from "./components/auth/Login";
import RequestReset from "./components/auth/RequestReset";
import NewPassword from "./components/auth/NewPassword";
// making use of Alerts
import Alerts from "./components/layout/Alerts";
// to make the home page a private route
import PrivateRoute from "./components/routing/PrivateRoute";

import ContactState from "./context/contact/ContactState";
// import auth state
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import setAuthToken from "./utils/setAuthToken";
import "./App.css";
// look for the token look for it and set it in the header
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    // wrap the AuthState as the first provider here so the entier app has access
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar />
              <div className="container">
                {/* making use of Alerts  */}
                <Alerts />
                <Switch>
                  {/* wraping the home page in private route */}
                  <PrivateRoute exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                  {/* adding register to the routes in the Switch  */}
                  <Route exact path="/register" component={Register} />
                  {/* add login to routes  */}
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/requestReset" component={RequestReset} />
                  <Route exact path="/newPassword" component={NewPassword} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
};

export default App;

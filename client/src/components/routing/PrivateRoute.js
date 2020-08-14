// this route will be enable us to wrap Route in a PriveateRoute instead of just a Route
// so that user needs to be logged in to see that route
// this is a standard way to set up a private route in react
import React, { useContext } from "react";
// need react router because we are creating a route and need to redirect
import { Route, Redirect } from "react-router-dom";
// need auth context - to know if we are logged in and get the loading property
import AuthContext from "../../context/auth/authContext";
// in props here, destructure and take in a component: set to Component
// and use ...rest (the rest operator) to get all the stuff passed in
const PrivateRoute = ({ component: Component, ...rest }) => {
  // initialie
  const authContext = useContext(AuthContext);
  // desturcture
  const { isAuthenticated, loading } = authContext;

  return (
    // the Route from react router is inside of this private route
    <Route
      // pass in the estra props
      {...rest}
      // render takes props
      render={(props) =>
        //use props to find out if user is authenticated when state is done loading
        !isAuthenticated && !loading ? (
          // Redirect comes from react router
          // send them to login if the are not authenticated
          <Redirect to="/login" />
        ) : (
          // They are authenticated so load whatever the Component is passing in the props
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;

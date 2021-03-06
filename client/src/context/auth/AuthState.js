// TODO handle password reset
// Auth State /Context to handle all of our authentication
import React, { useReducer } from "react";
// calling action in AuthState called register will hit server ,
//put user in DB and return a token the we have to handle
// using axios to make request to back end server
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
// use the global setAuthToken
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REQUEST_RESET_SUCCESS,
  REQUEST_RESET_FAIL,
  RESET_SUCCESS,
  RESET_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

const AuthState = (props) => {
  const initialState = {
    // get the token from local storage
    token: localStorage.getItem("token"),
    // initialy is null this will tell us if we are logged in or not
    isAuthenticated: null,
    //this will be true until we make request and get response back and set it to false
    loading: true,
    // which user
    user: null,
    error: null,
  };
  // get the authReducer from that file
  const [state, dispatch] = useReducer(authReducer, initialState);
  ///////////////////////// ///// actions
  // Load User - will take care of checking which  user is logged in will hit the auth end point and get the user data

  // Get user from back end and put into state, validate authentication to access the home page for example- in client, src utils
  // asynce because we are making a request to the back end
  const loadUser = async () => {
    // set the token into a global header in a seprate file that does that so we dont have to repeat that for every method like when we fetch and add contacts.
    if (localStorage.token) {
      // if the token exists set it in the header- need to call this here and in the main app.js because we want this to load every time the main coponent loads
      setAuthToken(localStorage.token);
    }

    try {
      //get request to the route that checks token to see if are a valid user
      const res = await axios.get("/api/auth");
      // if you are a valid user dispath
      dispatch({
        type: USER_LOADED,
        // res.data here is user data
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  ///////////////////////// Register User - sign user up , get token back
  // register will be called in the onSubmit in the Register.js component.
  // async , takes in formData to register user
  const register = async (formData) => {
    // post request sending data so need content type header of applicaiton/json
    // to do this in axios need a config object
    const config = {
      //  with a headers object
      headers: {
        "Content-Type": "application/json",
      },
    };
    // put this in a try  catch because we are making a reuest
    try {
      // axios is making reqeust to back end
      // variable for response res
      // await on post reqeust which returns a promise
      // url coming from the proxy value in package.json + "/api/users"
      // then formData and the config defined above
      const res = await axios.post("/api/users", formData, config);
      // dispatch to reducer
      dispatch({
        // the type is going to be register success
        type: REGISTER_SUCCESS,
        // in res.data is the token
        payload: res.data,
      });
      // after successful register loadUser so once we register it should load the user

      loadUser();
    } catch (err) {
      dispatch({
        // if the email is already taken will get register fail
        type: REGISTER_FAIL,
        // by putting msg in payload the error email alaready taken can show on front end
        payload: err.response.data.msg,
      });
    }
  };

  ////////////////////////// Login User - log user in and get token
  // need the formData and the header
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      // go to auth end point
      const res = await axios.post("/api/auth", formData, config);

      dispatch({
        // dispatch login success
        type: LOGIN_SUCCESS,
        // send response data as payload
        payload: res.data,
      });
      // load the user
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        // if there is an err put the message in state
        payload: err.response.data.msg,
      });
    }
  };
  //// TODO request reset - will take user email validate it and generate crypto token
  // with expiration, add to user in the db  , sendgrid email
  //TODO after password reset load user
  //   // register will be called in the onSubmit in the RequestReset.js component.
  // async , takes in formData to  for resetReqeust
  const requestReset = async (formData) => {
    // post request sending data so need content type header of applicaiton/json
    // to do this in axios need a config object
    const config = {
      //  with a headers object
      headers: {
        "Content-Type": "application/json",
      },
    };
    // put this in a try  catch because we are making a reuest
    try {
      // axios is making reqeust to back end
      // variable for response res
      // await on post reqeust which returns a promise
      //TODO ? think this should be api/auth not user url coming from the proxy value in package.json + "/api/users"
      // then formData and the config defined above
      // this is not working does this need to e in backticks ?
      const res = await axios.post("/api/auth/requestReset", formData, config);
      // dispatch to reducer
      dispatch({
        // the type is going to be register success
        type: REQUEST_RESET_SUCCESS,
        // in res.data is the token
        payload: res.data,
      });
      // after successful register loadUser so once we register it should load the user
      // TODO no user to load yet
      // loadUser();
    } catch (err) {
      dispatch({
        // if the email is already taken will get register fail
        type: REQUEST_RESET_FAIL,
        // by putting msg in payload the error email alaready taken can show on front end
        payload: err.response.data.msg,
      });
    }
    // console.log("request reset");
  };

  //// TODO  set new password - will get the token from the url, match it with the token
  // in the db, allow for new password, update the db , log in user and set local storage with logged in token
  //put request wiht matching put request in auth routes

  // const reset = async (token, password) => {
  const reset = async (user, token) => {
    // console.log("new Password ");
    console.log("user inside auth state", user);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("user.token.token in AuthState.js", user.token.token);
    try {
      //TODO get the token value vs the object ????
      const res = await axios.put(`/api/auth/reset/${user.token.token}`, user, config);
  
      //THIS WORKS TOO
      // const res = await axios.put(
      //   `/api/auth/reset/${"a1095c98dd6d431906e1bf30759e1517c9960fd68a056327463866287fd46909"}`,
      //   user,
      //   config
      // );

      //this works
      // const res = await axios.put(
      //   `/api/auth/reset/bfeabf43c0d13d553b6b6697c1225f655f2f23f6e0250246eb40054fdd7b7c59`,
      //   user,
      //   config
      // );
      // this works
      // const res = await axios.put(
      //   "http://localhost:3000/api/auth/reset/bfeabf43c0d13d553b6b6697c1225f655f2f23f6e0250246eb40054fdd7b7c59",
      //   user,
      //   config
      // );

      dispatch({
        type: RESET_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: RESET_FAIL,
        payload: err.response.msg,
      });
    }
    // try {
    //   const res = await axios.put("/api/auth/reset/", formData, config);

    //   dispatch({
    //     type: RESET_SUCCESS,
    //     payload: res.data,
    //   });
    // } catch (err) {
    //   dispatch({
    //     type: RESET_FAIL,
    //     payload: err.response.msg,
    // //   });
    // }
  };

  // Logout - will destroy the token and clean up
  // dispatch the logout type to authReducer
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors -
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      // all the state values and functions(actions) being used and passed
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        // need to export the register function
        register,
        // exporing requestReset
        requestReset,
        reset,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;

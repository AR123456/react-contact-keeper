// Auth State /Context to handle all of our authentication
// TODO  handle password reset
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REQUEST_RESET_SUCCESS,
  REQUEST_RESET_FAIL,
  GET_RESET,
  GET_RESET_ERROR,
  RESET_SUCCESS,
  RESET_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

export default (state, action) => {
  // look at action.type
  switch (action.type) {
    //
    case USER_LOADED:
      return {
        // get all the state
        ...state,
        isAuthenticated: true,
        loading: false,
        // user data from the payload, from the response
        user: action.payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // set the jwt in local storage, get it from the payload
      localStorage.setItem("token", action.payload.token);
      return {
        // return state to component
        ...state,
        // put token in state
        ...action.payload,
        // make true
        isAuthenticated: true,
        // this is done so no longer loading
        loading: false,
      };
    case REQUEST_RESET_SUCCESS:
      return {
        // return state to component
        ...state,
        // user data from the payload, from the response
        user: action.payload,
        // this is done so no longer loading
        loading: false,
      };
    case RESET_SUCCESS:
      return {
        ...state,
        // TODO need to remove from DB at some point
        // resetToken: null,
        // resetTokenExpiration: null,
      };
    case GET_RESET:
      return {
        ...state,
      };
    case GET_RESET_ERROR:
    case RESET_FAIL:
    case REQUEST_RESET_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      // removed the token from local storage
      localStorage.removeItem("token");
      // resetting this stuff
      return {
        ...state,
        // token null
        token: null,
        //set back to false
        isAuthenticated: false,
        // not loading
        loading: false,
        // no user
        user: null,
        // error is in the payload (back in action if we fail the payload includes the error message )
        error: action.payload,
      };

    // CLEAR_ERRORS coming from AuthState
    case CLEAR_ERRORS:
      // return the state object
      return {
        ...state,
        // change error to null
        error: null,
      };
    default:
      return state;
  }
};

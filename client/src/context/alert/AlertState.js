// for app alerts
import React, { useReducer } from "react";
import uuid from "uuid";
import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";
// bring in from types
import { SET_ALERT, REMOVE_ALERT } from "../types";

const AlertState = (props) => {
  // initialy this will be an array of alerts, alert objects
  const initialState = [];
  // bringing in alert reducer
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert action / method
  // will take in msg, type and tiemout
  // each alert in the array needs a unique ID so using uuid for that
  const setAlert = (msg, type, timeout = 5000) => {
    // syntax for random id
    const id = uuid.v4();
    dispatch({
      // send dipatch to the reducer with type SET_ALERT
      type: SET_ALERT,
      // and send payload that is object with msg, type and id
      payload: { msg, type, id },
    });
    // setup for alert to disapear after set amount of time
    // in the arrow function call dispatch to the reducer  type Remove alert and the payload is id so we
    // know which one to remove.  the id gets sent in payload to alertReducer The param at end is for timeout.
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    // return the AlertContext provider
    <AlertContext.Provider
      // value will be the alerts state(the whole array )
      value={{
        alerts: state,
        // and setAlert action
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
// to use put into App js
// now need a component to output the alert
// this is in the componets/ layout folder Alerts file

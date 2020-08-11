// for app alerts
// import  from types
import { SET_ALERT, REMOVE_ALERT } from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      //  returning the entire state array in an array, action.payload is the alert that got sent.
      return [...state, action.payload];
    case REMOVE_ALERT:
      // filter out the correct alert the one with the id that matches the alert in the payload that came from AlertState
      return state.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
};
// now need a component to output the alert
// this is in the componets/ layout folder Alerts file

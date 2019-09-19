import React, { useReducer } from "react";
import uuid from "uuid";
import ContactContext from "./contactContext";
import ContactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from "../types";

const ContactStare = props => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: "Jill Johnson",
        email: "jill@gmail.com",
        phone: "111-111-1111",
        type: "personal"
      },
      {
        id: 1,
        name: "Sara Watson",
        email: "sara@gmail.com",
        phone: "222-111-1111",
        type: "personal"
      },
      {
        id: 1,
        name: "Hary White",
        email: "harry@gmail.com",
        phone: "333-111-1111",
        type: "professional"
      }
    ]
  };
  ///pull out state and dispatch from reducer using reducer hooks
  const [state, dispatch] = userReducer(ContactReducer, initialState);
  //Add Contact
  // Delete Contact

  // Set current contact
  //Clear current contact
  //Update Contact
  //Filter Contacts
  // Clear Filter

  //// return provider in order to wrap the application in this contexts
  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};
export default ContactState;

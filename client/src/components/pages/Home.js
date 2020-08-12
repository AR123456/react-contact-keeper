// useContext and useEffect needed for authContext
import React, { useContext, useEffect } from "react";
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter";
import AuthContext from "../../context/auth/authContext";

const Home = () => {
  //initialize
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // run in useEffect , will run when component loads
    // looks at token , validate on back end and put user in state
    // this way the user stays authenticated
    authContext.loadUser();
    // just do this when component loads, disableing lint to stop warining
    // eslint-disable-next-line
  }, []);

  return (
    <div className="grid-2">
      <div>
        <ContactForm />
      </div>
      <div>
        <ContactFilter />
        <Contacts />
      </div>
    </div>
  );
};

export default Home;

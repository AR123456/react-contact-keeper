// will need to bring this into app js to use
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";

const RequestReset = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  //   const { login, error, clearErrors, isAuthenticated } = authContext;

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       props.history.push("/");
  //     }

  //     if (error === "Invalid Credentials") {
  //       setAlert(error, "danger");
  //       clearErrors();
  //     }
  //     // eslint-disable-next-line
  //   }, [error, isAuthenticated, props.history]);
  // because this is a form  use state to add the component level state

  const [user, setUser] = useState({
    // send in object that is state
    email: "",
  });
  // destructuring so that we can use as variables
  const { email } = user;
  // wireing up the onChange in the input's in the form groups
  // take in the event, setUser object , need current values so use ... the spread operator
  // using the name attributes on the inputs and set the value to what is in the value attribute
  // so every time we type it will enter the correct piece of state
  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  // wireing up the onSubmit in the form
  //takes in the event
  const onSubmit = (e) => {
    // preventDefault form behaivor
    e.preventDefault();
    // call a method to register when form submited.
    if (email === "") {
      setAlert("Please add your email", "danger");
    }
    // else {
    //   login({
    //     email,
    //   });
    // }
  };

  return (
    // class is form-container which is a more narrow form
    <div className="form-container">
      <h1>
        <span className="text-primary">Request Password Reset </span>
      </h1>
      {/* form an onSubmit  with form groups that have labels and inputs, inputs will have an onChange   */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>

        {/* input with type of submit and value of RequestReset   */}
        <input
          type="submit"
          value="RequestReset"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default RequestReset;

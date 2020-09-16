// need to bring this component into App.js to see it
import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";

const Reset = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;

  const { reset, error, clearErrors } = authContext;

  useEffect(() => {
    // check the token in url vs is there a user with this token in the DB
    // if not show error
    // if there is present reset pass word form  and redirect to the request reset page
    if (!user) {
      setAlert(error, "danger");
      clearErrors();
      props.history.push("/requestReset");
    }

    // eslint-disable-next-line
  }, [error, props.history]);
  // because this is a form  use state to add the component level state
  const [user, setUser] = useState({
    // send in object that is state

    password: "",
    password2: "",
  });
  // destructuring so that we can use as variables
  const { password, password2 } = user;
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
    if (password === "" || password2 === "") {
      setAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      reset({
        password,
      });
    }
  };
  return (
    // class is form-container which is a more narrow form
    <div className="form-container">
      <h1>
        Account <span className="text-primary">New Password</span>
      </h1>
      {/* form an onSubmit  with form groups that have labels and inputs, inputs will have an onChange   */}
      <form onSubmit={onSubmit}>
        {/* <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            // required
            // minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            // required
            // minLength="6"
          />
        </div>
        {/* input with type of submit and value of Register  */}
        <input
          type="submit"
          value="New Password"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};
export default Reset;

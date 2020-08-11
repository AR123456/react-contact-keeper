// need to bring this component into App.js to see it
import React, { useState, useContext, useEffect } from "react";
// bring in alertContext
import AlertContext from "../../context/alert/alertContext";
// bring in auth contexts that has the state management and axios call to back end
import AuthContext from "../../context/auth/authContext";

const Register = (props) => {
  const alertContext = useContext(AlertContext);
  // initialize authContext
  const authContext = useContext(AuthContext);
  // alertContext is going to allow us to show errors coming from the server side in the UI
  const { setAlert } = alertContext;
  // destructure from authContext

  const { register, error, clearErrors, isAuthenticated } = authContext;
  // want to show the errors from back end, put into a use effect hook
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    // checking to see if it mathces the actual error text, if this was a
    // larger app would want to give errors unique ids and use that
    if (error === "User already exists") {
      // setAlert to the error with a type of danger
      setAlert(error, "danger");
      // calling clearErrors tthat we got from authContext
      clearErrors();
    }
    // since we want this to run when error is added to state so add error
    // as a dependancy to use effect
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);
  // because this is a form  use state to add the component level state
  const [user, setUser] = useState({
    // send in object that is state
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  // destructuring so that we can use as variables
  const { name, email, password, password2 } = user;
  // wireing up the onChange in the input's in the form groups
  // take in the event, setUser object , need current values so use ... the spread operator
  // using the name attributes on the inputs and set the value to what is in the value attribute
  // so every time we type it will enter the correct piece of state
  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  // wireing up the onSubmit in the form
  //takes in the event
  //////// onSubmit is where we want to call register
  const onSubmit = (e) => {
    // preventDefault form behaivor
    e.preventDefault();
    // call a method to register when form submited.
    if (name === "" || email === "" || password === "") {
      setAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      // call register from the AuthState in context
      register({
        // register takes in  form data object
        name,
        email,
        password,
      });
    }
  };
  return (
    // class is form-container which is a more narrow form
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      {/* form an onSubmit  with form groups that have labels and inputs, inputs will have an onChange   */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
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
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        {/* input with type of submit and value of Register  */}
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};
export default Register;

// need to bring this component into App.js to see it
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";

const Reset = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  //TODO going to try this with useState instead
  // const { reset } = authContext;

  const { setAlert } = alertContext;
  //TODO seems like the use effect could be used to handle sending the token to
  // back end route to match up the token with what is in db
  // like matching up to valid email in the RequestReset
  // put the reset token and password in to state
  // how to get the reset token off of the  URL  to send to back end to do the comparison??

  // TODO google useEffect to make the axios request to get the token off url
  //  React Axios Tutorial   https://www.youtube.com/watch?v=bYFYF2GnMy8
  useEffect(() => {
    axios
      // 404 error with this
      .get("/api/auth/reset/:token")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line
  }, []);
  // because this is a form  use state to add the component level state
  const [user, setUser] = useState({
    // send in object that is state
    password: "",
    password2: "",
  });
  const [resetToken, setResetToken] = useState({
    // the token from the url
    resetToken: "", // will be token
  });
  // TODO  make the setResetToken - it will get the token from the URL
  // and pass it to  state to send to the back end

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
      //  TODO  this should be a method called reset , make this
      // in the context
      //TODO does this really need to be done with context ?
      // TODO try re writing with useState since I just need to pass this to the back end.
      // reset({
      //   password,
      // });
      //TODO call the setResetToken function that sends the token and password to the back end
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

import React, { Fragment, useContext } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// need auth and contact context
import AuthContext from "../../context/auth/authContext";
import ContactContext from "../../context/contact/contactContext";

const Navbar = ({ title, icon }) => {
  // initialize
  const authContext = useContext(AuthContext);
  const contactContext = useContext(ContactContext);
  // destructure
  const { isAuthenticated, logout, user } = authContext;
  const { clearContacts } = contactContext;

  const onLogout = () => {
    // logout and clearContacts are coming from AuthState
    logout();
    clearContacts();
  };
  // links will be shown based on criteria so putting the jsx into const
  // if user authenticated show the auth links
  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        {/* not logout directly because we want to logout and clearContacts */}
        {/* TODO for reset stuff onClick? onSubmit ?  */}
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );
  // adding Register and Login to nav bar if no logged in user
  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/requestReset">Reset</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <i className={icon} /> {title}
      </h1>
      {/* if authenticates show authlinks if not show guestLinks  */}
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};
Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: "Contact Keeper",
  icon: "fas fa-id-card-alt",
};

export default Navbar;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
// for welcome email
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// Load Keys
const keys = require("../config/keys");

const User = require("../models/User");
// TODO hide API key
const transporter = nodemailer.createTransport(
  sendgridTransport({
    // auth object
    auth: {
      api_key: keys.api_key,
    },
  })
);

// @route     POST api/users
// @desc      Register a user
// @access    Public
// On the Front end the component AuthState is interacting with this route in an axios request
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          //  this jwt to persist log in is being sent to the front end
          // recived in the AuthState.js component
          res.json({ token });
        }
      );
      // after registration is complete sent Welcome email
      // js object we want to send email too
      transporter.sendMail({
        to: email,
        from: "contact@node-complete.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
/// TODO Route or Routes to handle  getting the reset token off the URL from the front end
// match it to db , if no match send invalid warning to front and redirect to the requestReset form
// if there is a match get the password supplied by front end, validate it for password requirements
// if not throw error and rediredt to the form to pick password.  Remember that the token has been validated
// so user dosent have to start over.
// if the password is good update it in the DB, give the user a persistant login and redirect to a page
// dynamic get /reset/{token}
// need in state userId ?  for sure token
module.exports = router;

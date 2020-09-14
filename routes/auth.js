const express = require("express");
const router = express.Router();
// node js built in crypto
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
// for reset email
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// Load Keys
const keys = require("../config/keys");
// TODO hide API key
const transporter = nodemailer.createTransport(
  sendgridTransport({
    // auth object
    auth: {
      api_key: keys.api_key,
    },
  })
);

const User = require("../models/User");

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/auth
// @desc      Auth user & get token to persist login
// @access    Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

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
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     POST  api/auth/requestReset
// @desc      Allow user to request a password reset verify email
// @access    Public
// TODO get the request from front end, if email in the DB generate a re set token
// seems like this is a get first , then post
// this did not work, backing out for now and will work on confrimation email first
router.post(
  "/requestReset",
  // "/requestReset",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        // this send email is working
        return res.status(400).json({ msg: "Invalid Email" });
      }
      // TODO  there is something wrong in this section
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err);
          // TODO  redirect to requestReset
          return res.redirect("/requestReset");
        }
        // this is creating the resetToken and date
        const token = buffer.toString("hex");
        // check out also using createHash to also hast
        user.resetToken = token;
        // ten minutes
        user.resetTokenExpiration = Date.now() + 10 * 60 * 1000;
        return user.save().then((result) => {
          // we have a matching users and have given user token, saved it to the db
          // now send email
          //TODO this redirect is not redirecting , the request reset form is not clearing after submit
          res.redirect("/reset");
          // TODO make this a dynamic link for reset
          // send email with link in it
          transporter.sendMail({
            to: email,
            from: "contact@node-complete.com",
            subject: "Reset password has been requested ",
            html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/api/auth/reset/${token}">link</a> to set a new password.</p>
        `,
          });
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT  /reset
// @desc    reset page where user adds new PW
// @access    Private
router.put(
  "/reset/:token",
  // do some checking/ valiation but not sure if it belongs here
  // [
  //   check(
  //     "password",
  //     "Please enter a password with 6 or more characters"
  //   ).isLength({ min: 6 }),
  // ],
  async (req, res) => {
    ///// this is part of the error checking, not sure  if this is the place
    ///check to make sure that the passwords entered in the form match one anohter
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { password } = req.body;
    const { token } = req.params;
    // this console.log is showing the token when I do the put from postman
    console.log(token);
    //this console.log is showing the password when I do the put from postman
    console.log(password);
    //find the user
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(404).json({ msg: "something is up with the token" });
      }

      // do all the salt and bcrpt work
      const salt = await bcrypt.genSalt(10);
      // salt and hash the new password
      user.password = await bcrypt.hash(password, salt);

      user.resetToken = "undefined";
      user.resetTokenExpiration = "undefined";

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      // add a jwt

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
      // use transporter to send an email confirming password hanged

      // after registration is complete sent Welcome email
      // js object we want to send email too
      // transporter.sendMail({
      //   to: email,
      //   from: "contact@node-complete.com",
      //   subject: "Your password has been changed",
      //   html: "<h1>The Password on your account has been changed.</h1>",
      // });
      /// redirect to the home page
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;

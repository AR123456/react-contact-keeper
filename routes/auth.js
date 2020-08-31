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
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
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
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
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
// @route     GET
// @desc      Get the token
// @access    Private- need the token
// front end needs to get the token  then send it back with the new password.
// router.get("/reset/:token", async (req, res) => {
router.get("/reset/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: "There was a problem" });
    }
    // or is this
    // res.render("/reset", token);
    // res.json(user);
    res.send(token, user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// @route     POST  /reset
// @desc      present reset page where user adds new PW
// @access    Private
// router.post("/reset/:token", async (req, res) => {
router.post("/reset/:token", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //find the user
  const token = req.params.token;
  // const { token } = req.body;

  try {
    let user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ msg: "something is up with the token" });
    }
    if (!password) {
      return res.status(404).json({ msg: "something is up with the password" });
    }
    // set the new pass word as the password
    // is this the syntax to update the users password
    user = new User({
      password,
    });
    // do all the salt and bcrpt work
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

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
    transporter.sendMail({
      to: email,
      from: "contact@node-complete.com",
      subject: "Your password has been changed",
      html: "<h1>The Password on your account has been changed.</h1>",
    });
    /// redirect to the home page
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

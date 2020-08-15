const express = require("express");
const router = express.Router();
// node js built in crypto
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

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

// @route     POST  api/auth/postReset
// @desc      Allow user to request a password reset
// @access    Public
// TODO get the request from front end, if email in the DB generate a re set token
// seems like this is a get first , then post
// this did not work, backing out for now and will work on confrimation email first
// router.post(
//   "/",
//   [check("email", "Please include a valid email").isEmail()],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { email } = req.body;
//     try {
//       let user = await User.findOne({ email });

//       if (!user) {
//         return res.status(400).json({ msg: "Invalid Credentials" });
//       }
//       crypto
//         .randomBytes(32, (err, buffer) => {
//           if (err) {
//             console.log(err);
//             // TODO  redirect to requestReset
//             // return res.redirect("/requestReset")
//           }
//           const token = buffer.toString("hex");
//           user.resetToken = token;
//           user.resetTokenExpiration = Date.now() + 3600000;
//           return user.save();
//         })
//         .then((result) => {
//           // we have a matching users and have given user token, saved it to the db
//           // now send email
//           res.redirect("/");
//           // TODO make this a dynamic link for reset
//           transporter.sendMail({
//             to: email,
//             from: "ContactKeeper.com",
//             subject: "Reset password has been requested ",
//             html: `
//             <p>You requested a password reset</p>
//             <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//           `,
//           });
//         });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

module.exports = router;

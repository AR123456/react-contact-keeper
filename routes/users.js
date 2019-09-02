const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
// @route POST  api/users
//@desc  Regitster a user
//@access - Public
router.post(
  "/",
  [
    check("name", "Please include a name ")
      .not()
      .isEmpty(),
    check("email", "Please incule a valid email").isEmail(),
    check(
      "password",
      "Please enter a pasword with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("passed");
  }
);

//export the router
module.exports = router;

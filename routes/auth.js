const express = require("express");
const router = express.Router();

// @route GET  api/users
//@desc  Get logged in user
// @access - Private
router.get("/", (req, res) => {
  res.send("Registered a user");
});

// @route POST   api/users
//@desc     Auth user and get token
// @access - Public
router.post("/", (req, res) => {
  res.send("Log in user ");
});

//export the router
module.exports = router;

//export the router
module.exports = router;

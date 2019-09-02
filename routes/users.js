const express = require("express");
const router = express.Router();

// @route POST  api/users
//@desc  Regitster a user
//@access - Public
router.post("/", (req, res) => {
  res.send("Register a user");
});

//export the router
module.exports = router;

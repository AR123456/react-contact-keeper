const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route GET api/contacts
//@desc  GEt all users contacts
//@access - Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST  api/contact
//@desc  Add a new contact
//@access - private
router.post("/", (req, res) => {
  res.send("Add contact ");
});
// @route PUT api/contact/:ic
//@desc  Update contact
//@access - private
router.put("/:id", (req, res) => {
  res.send("Update contact ");
});
// @route DELETE  api/contact/:ic
//@desc  remove a contact  contact
//@access - private
router.delete("/:id", (req, res) => {
  res.send("delete contact   ");
});

//export the router
module.exports = router;

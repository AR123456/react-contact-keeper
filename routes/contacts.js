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
router.post(
  "/",
  // using [] for multiple middle ware use
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // pull data out of body
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
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

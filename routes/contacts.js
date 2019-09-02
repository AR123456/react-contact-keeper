const express = require("express");
const router = express.Router();

// @route GET api/contacts
//@desc  GEt all users contacts
//@access - Private
router.get("/", (req, res) => {
  res.send("get all contacts");
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

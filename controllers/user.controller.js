const User = require("../models/user.model");

// Create and Save a new User
const createUser = (req, res, next) => {
  console.log(req.body);
  // Validate request
  if (!req.body.email) {
    return res.status(400).send({
      message: "User name, email, and password must be provided.",
      success: false,
    });
  }
  // Create a User object
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
  });
  // Save the User in the database
  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

module.exports = { createUser };

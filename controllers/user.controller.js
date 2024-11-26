const User = require("../models/user.model");

// Create and Save a new User
const createUser = (req, res, next) => {
  // Validate request
  switch (true) {
    case !req.body.mobile:
      return res.status(400).send({
        message: "Mobile number must be provided.",
        success: false,
      });
    case !req.body.email:
      return res.status(400).json({
        message: "Email must be provided.",
        success: false,
      });
    case !req.body.password:
      return res.status(400).send({
        message: "Password must be provided.",
        success: false,
      });

    default:
      break;
  }
  // Email already exist validation
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: "Email already exists.",
        success: false,
      });
    } else {
      // Create a User object
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
      });
      // Save the User in the database
      newUser
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    }
  });
};

module.exports = { createUser };

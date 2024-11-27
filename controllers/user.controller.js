const User = require("../models/user.model");

// Create and Save a new User
// const createUser = (req, res, next) => {
//   // Validate request
//   switch (true) {
//     case !req.body.mobile:
//       return res.status(400).send({
//         message: "Mobile number must be provided.",
//         success: false,
//       });
//     case !req.body.email:
//       return res.status(400).send({
//         message: "Email must be provided.",
//         success: false,
//       });
//     case !req.body.password:
//       return res.status(400).send({
//         message: "Password must be provided.",
//         success: false,
//       });

//     default:
//       break;
//   }
//   // User already exist validation
//   User.findOne({
//     $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
//   }).then((user) => {
//     if (user) {
//       // return res.status(400).send({
//       //   message: "User already exists with this email or mobile.",
//       //   success: false,
//       // });
//       throw new Error("User already exists with this email or mobile")
//     } else {
//       // Create a User object
//       const newUser = new User({
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         mobile: req.body.mobile,
//         password: req.body.password,
//       });

//       // Save the User in the database
//       newUser
//         .save()
//         .then((data) => {
//           res.send({
//             message: "User created successfully!",
//             success: true,
//             data,
//           });
//         })
//         .catch((err) => {
//           res.status(500).send({
//             message:
//               err.message || "Some error occurred while creating the User.",
//           });
//         });
//     }
//   });
// };

const createUser = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.mobile) {
      throw new Error("Mobile number must be provided.");
    }
    if (!req.body.email) {
      throw new Error("Email must be provided.");
    }
    if (!req.body.password) {
      throw new Error("Password must be provided.");
    }

    // User already exists validation
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (user) {
      throw new Error("User already exists with this email or mobile.");
    }

    // Create a User object
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
    });

    // Save the User in the database
    const data = await newUser.save();
    res.send({
      message: "User created successfully!",
      success: true,
      data,
    });
  } catch (err) {
    next(err); // Pass the error to the errorHandler middleware
  }
};

module.exports = { createUser };

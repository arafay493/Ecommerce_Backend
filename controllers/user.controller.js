const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
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

const createUserController = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.mobile) {
      res.status(400); // Bad Request
      throw new Error("Mobile number must be provided.");
    }
    if (!req.body.email) {
      res.status(400); // Bad Request
      throw new Error("Email must be provided.");
    }
    if (!req.body.password) {
      res.status(400); // Bad Request
      throw new Error("Password must be provided.");
    }

    // User already exists validation
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (user) {
      res.status(409); // Conflict
      throw new Error("User already exists with this email or mobile.");
    }

    // Create a User object
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      role: req.body.role,
    });
    const data = await newUser.save();
    // res.status(201).send({
    //   message: "User created successfully!",
    //   success: true,
    //   data,
    // });
    res.status(201); // Created
    res.locals.message = "User created successfully!";
    res.locals.data = data;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

const loginUserController = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.email) {
      res.status(400); // Bad Request
      throw new Error("Email must be provided.");
    }
    if (!req.body.password) {
      res.status(400); // Bad Request
      throw new Error("Password must be provided.");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.isPasswordMatched(req.body.password))) {
      res.status(401); // Unauthorized
      throw new Error("Invalid email or password.");
    }
    //* Generate and send JWT token
    const token = await user.generateAuthToken();
    //* Convert Mongoose document to a plain object
    const { password, ...userData } = user.toObject();
    // const userData = user.toObject();
    // delete userData.password;
    res.status(200); // OK
    res.locals.message = "User logged in successfully!";
    // res.locals.data = { token };
    res.locals.data = {
      token,
      user: userData,
      // user,
    };
    next(); // Pass to responseHandler
  } catch (error) {
    next(error); // Pass error to the middleware
  }
};

module.exports = { createUserController, loginUserController };

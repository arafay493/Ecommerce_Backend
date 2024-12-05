const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validateMongoDbId } = require("../utils/validateMongodbId");
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

//? Register A User Controller
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

//? Login A User Controller
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
    //* Generate and send JWT Referesh token
    const refreshToken = await user.generateRefreshAuthToken();
    const updateUser = await User.findByIdAndUpdate(
      user.id,
      { refreshToken },
      { new: true }
    );
    //* Set refresh token in the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
      // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }); // 7 days
    //* Convert Mongoose document to a plain object
    const { password, ...userData } = updateUser.toObject();
    // const userData = user.toObject();
    // delete userData.password;
    res.status(200); // OK
    res.locals.message = "User logged in successfully!";
    // res.locals.data = { token };
    res.locals.data = {
      token,
      refreshToken,
      user: userData,
      // user,
    };
    next(); // Pass to responseHandler
  } catch (error) {
    next(error); // Pass error to the middleware
  }
};

//? Handle Refresh Token
const refreshTokenController = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) {
      res.status(401); // Unauthorized
      throw new Error("Refresh token is required.");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      res.status(401); // Unauthorized
      throw new Error("Invalid refresh token.");
    }
    const userData = user.toObject();
    //* Generate new JWT token
    const token = await user.generateAuthToken();
    //* Generate and send JWT Referesh token
    const newRefreshToken = await user.generateRefreshAuthToken();
    const updateUser = await User.findByIdAndUpdate(
      user.id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    console.log(updateUser);
    //* Set refresh token in the cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
      // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }); // 7 days
    //* Convert Mongoose document to a plain object
    const { password, ...newUserData } = updateUser.toObject();
    // // const userData = user.toObject();
    // // delete userData.password;
    res.status(200); // OK
    res.locals.message = "Refresh token generated successfully!";
    res.locals.data = {
      token,
      refreshToken: newRefreshToken,
      user: newUserData,
    };
    next();
  } catch (error) {
    next(error); // Pass error to the middleware
  }
};

//? Get All Users List
const getAllUsersController = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200); // OK
    res.locals.message = "Users list fetched successfully!";
    res.locals.data = users;
    next(); // Pass to responseHandler
  } catch (error) {
    next(error); // Pass error to the middleware
  }
};

//? Get A User By ID
const getUserByIdController = async (req, res, next) => {
  try {
    // Validate ObjectId
    validateMongoDbId(req.user._id, res);
    // const user = await User.findById(req.params.userId);
    // const user = await User.findById(req.body.userId);
    const user = await User.findOne({ _id: req.user._id }, { password: 0 });
    // console.log(mongoose.Types.ObjectId.isValid(req.body.userId));
    if (!user) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }
    res.status(200); // OK
    res.locals.message = "User fetched successfully!";
    res.locals.data = user;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
    console.log(err);
  }
};

//? Delete A User By ID
const deleteUserController = async (req, res, next) => {
  try {
    // Validate ObjectId
    validateMongoDbId(req.body.userId, res);
    const user = await User.findOne({ _id: req.body.userId });
    const userData = user.toObject();
    delete userData.password;
    const result = await User.deleteOne({ _id: req.body.userId });
    if (result.deletedCount === 0) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }
    res.status(200); // OK
    res.locals.message = "User Deleted successfully!";
    res.locals.data = {
      ...userData,
      deletedCount: result.deletedCount,
    };
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

//? Delete A User By ID
const deleteUserByQueryParamsIdController = async (req, res, next) => {
  try {
    const { userId } = req.query;
    // Validate ObjectId
    validateMongoDbId(userId, res);
    const user = await User.findOne({ _id: userId });
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }
    const userData = user.toObject();
    delete userData.password;
    res.status(200); // OK
    res.locals.message = "User Deleted successfully!";
    res.locals.data = {
      ...userData,
      deletedCount: result.deletedCount,
    };
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

//? Delete A User By ID
const deleteUserByParamsIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Validate ObjectId
    validateMongoDbId(userId, res);
    //todo: Method 1
    // const user = await User.findByIdAndDelete(userId).select(
    //   "-password"
    // );
    //todo: Method 2
    // Find and delete the user in one step
    // const user = await User.findOneAndDelete({ _id: userId }).select(
    //   "-password -__v"
    // );
    //todo: Method 3
    // Use Mongoose's deleteOne method with query object
    // const user = await User.deleteOne({ _id: userId });
    //todo: Method 4
    // Use Mongoose's deleteOne method with query object and projection
    // const user = await User.deleteOne({ _id: userId }, { password: 0 }); // Exclude
    //todo: Method 5
    // Use Mongoose's findByIdAndDelete method with projection
    // const user = await User.findByIdAndDelete(userId, { password: 0 }); // Exclude
    //todo: Method 6
    // Use Mongoose's findOneAndDelete method with projection
    // const user = await User.findOneAndDelete({ _id: userId }, { password: 0 }); // Exclude
    //todo: Method 7
    // Use Mongoose's findByIdAndDelete method with projection and select
    // const user = await User.findOneAndDelete({ _id: userId }).select({
    //   password: 0, // Exclude
    //   __v: 0,   // Exclude
    // });
    //todo: Method 8
    // Use Mongoose's findOneAndDelete method with projection and select
    const fieldsToExclude = ["password", "__v"];
    const projection = fieldsToExclude.map((field) => `-${field}`).join(" ");

    const user = await User.findOneAndDelete({ _id: userId }).select(
      projection
    );

    if (!user) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }
    res.status(200); // OK
    res.locals.message = "User Deleted successfully!";
    res.locals.data = {
      ...user.toObject(),
      deletedCount: 1,
    };
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

//? Update A User By ID
const updateUserController = async (req, res, next) => {
  try {
    // Validate ObjectId
    validateMongoDbId(req.user._id, res);
    const currentUser = await User.findById(req.user._id, {
      updatedAt: 0,
      createdAt: 0,
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-updatedAt -createdAt");
    if (!updatedUser) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }
    // Convert to plain objects and compare
    if (
      JSON.stringify(currentUser.toObject()) ===
      JSON.stringify(updatedUser.toObject())
    ) {
      res.status(409); // Conflict
      throw new Error("No changes made to the user.");
    }
    const { password, __v, ...resData } = updatedUser.toObject();
    res.status(200); // OK
    res.locals.message = "User updated successfully!";
    res.locals.data = resData;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

const updateUserSpecificFieldController = async (req, res, next) => {
  try {
    // const { userId } = req.body; // Extract the userId from the request body
    const userId = req.user._id; // Extract the userId from the request body

    // Validate ObjectId
    validateMongoDbId(userId, res);

    // Check if the user exists
    const currentUser = await User.findById(userId, {
      updatedAt: 0,
      createdAt: 0,
    });
    if (!currentUser) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }

    // Perform the partial update
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields before updating
    }).select("-updatedAt -createdAt");

    // Compare if there are no changes
    if (
      JSON.stringify(currentUser.toObject()) ===
      JSON.stringify(updatedUser.toObject())
    ) {
      res.status(409); // Conflict
      throw new Error("No changes made to the user.");
    }

    // Remove sensitive or unnecessary fields from the response
    const { password, __v, ...resData } = updatedUser.toObject();

    res.status(200); // OK
    res.locals.message = "User updated successfully!";
    res.locals.data = resData;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

//? Block A User By ID
const blockUserByParamsIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Validate ObjectId
    validateMongoDbId(userId, res);

    // Check if the user exists
    const currentUser = await User.findById(userId, {
      updatedAt: 0,
      createdAt: 0,
    });
    if (!currentUser) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }

    // Perform the partial update
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields before updating
      projection: { updatedAt: 0, createdAt: 0 }, // Exclude fields
    });

    // Compare updated fields explicitly
    const changesMade = Object.keys(req.body).some(
      (key) => currentUser[key] !== req.body[key]
    );
    if (!changesMade) {
      res.status(409); // Conflict
      throw new Error("This user has already been blocked.");
    }

    // Remove sensitive or unnecessary fields from the response
    const { password, __v, ...resData } = updatedUser.toObject();

    res.status(200); // OK
    res.locals.message = "User has been successfully blocked!";
    res.locals.data = resData;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

//? Unblock A User By ID
const unblockUserByParamsIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Validate ObjectId
    validateMongoDbId(userId, res);

    // Check if the user exists
    const currentUser = await User.findById(userId, {
      updatedAt: 0,
      createdAt: 0,
    });
    if (!currentUser) {
      res.status(404); // Not Found
      throw new Error("User not found.");
    }

    // Perform the partial update
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields before updating
      projection: { updatedAt: 0, createdAt: 0 }, // Exclude fields
    });

    // Compare updated fields explicitly
    const changesMade = Object.keys(req.body).some(
      (key) => currentUser[key] !== req.body[key]
    );
    if (!changesMade) {
      res.status(409); // Conflict
      throw new Error("This user has already been unblocked.");
    }

    // Remove sensitive or unnecessary fields from the response
    const { password, __v, ...resData } = updatedUser.toObject();

    res.status(200); // OK
    res.locals.message = "User has been successfully unblocked!";
    res.locals.data = resData;
    next(); // Pass to responseHandler
  } catch (err) {
    next(err); // Pass error to the middleware
  }
};

module.exports = {
  createUserController,
  loginUserController,
  refreshTokenController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  deleteUserByQueryParamsIdController,
  deleteUserByParamsIdController,
  updateUserController,
  updateUserSpecificFieldController,
  blockUserByParamsIdController,
  unblockUserByParamsIdController,
};

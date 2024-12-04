const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    //? Way 1
    //   const token = req.headers["authorization"]?.split(" ")[1];
    //? Way 2
    const token = req.headers.authorization?.split(" ")[1];
    // If token is not provided, send a 401 Unauthorized response
    if (!token) {
      res.status(401); // Unauthorized
      throw new Error("Access denied. No token provided.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          if (err.name === "TokenExpiredError") {
            const error = new Error("Token has expired. Please login again.");
            res.statusCode = 403; // Forbidden
            throw error;
          } else if (err.name === "JsonWebTokenError") {
            const error = new Error("Invalid token. Access denied.");
            res.statusCode = 403; // Forbidden
            throw error;
          } else {
            const error = new Error(
              "An unexpected error occurred during token verification."
            );
            res.statusCode = 500; // Internal Server Error
            throw error;
          }
        }
        return decoded;
      }
    );
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findOne(
      { _id: req.user._id },
      { password: 0 }
    );
    if (user.role !== "admin") {
      const error = new Error(
        "Access denied. Only admin users can perform this action."
      );
      res.statusCode = 403; // Forbidden
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, isAdmin };

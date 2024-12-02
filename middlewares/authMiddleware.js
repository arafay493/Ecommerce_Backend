const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    //   const token = req.headers["authorization"]?.split(" ")[1];
    const token = req.headers.authorization?.split(" ")[1];
    // If token is not provided, send a 401 Unauthorized response
    if (!token) {
      res.status(401); // Unauthorized
      throw new Error("Access denied. No token provided.");
    }

    // If token is valid, decode it and attach the decoded payload to req.user
    // If token is expired, send a 403 Forbidden response
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Authentication Middleware Running...............", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).send({ message: "Token Expired" });
    // next(error);
  }
};

module.exports = { authMiddleware };

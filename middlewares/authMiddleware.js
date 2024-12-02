const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
  // Add your authentication logic here
  // Example:
//   const token = req.headers["authorization"]?.split(" ")[1];
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   try {
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).message({ message: 'Invalid token' });
//   }
  // req.user = decoded;
  // For example, validate JWT token
  // If token is expired, send a 403 Forbidden response
  // If token is not provided, send a 401 Unauthorized response
  // If token is valid, continue to the next middleware
  // If token is invalid, send a 401 Unauthorized response
  console.log("Authentication Middleware Running..............." , decoded);
//   next();
};

module.exports = { authMiddleware };

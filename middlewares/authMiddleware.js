const authMiddleware = async (req, res, next) => {
  // Add your authentication logic here
  // For example, validate JWT token
  // If token is valid, continue to the next middleware
  // If token is invalid, send a 401 Unauthorized response
  console.log("Authentication Middleware Running...............");
  next();
};

module.exports = { authMiddleware };

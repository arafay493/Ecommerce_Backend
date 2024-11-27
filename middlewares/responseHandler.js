const responseHandler = (req, res, next) => {
  // Check if data or error is already set in res.locals
  const statusCode = res.statusCode || 200; // Default to 200 for success

  res.status(statusCode).send({
    success: statusCode >= 200 && statusCode < 400, // Success is true for 2xx and 3xx
    message: res.locals.message || "Request completed successfully.",
    data: res.locals.data || null,
  });
};

module.exports = responseHandler;

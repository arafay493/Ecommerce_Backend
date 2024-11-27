//not found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl()}`);
  res.status(404);
  next(error);
};

//error handling

// const errorHandler = (err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({
//     error: {
//       message: err.message,
//       stack: err.stack,
//     },
//   });
// };
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).send({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler, notFound };

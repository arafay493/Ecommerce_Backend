const express = require("express");
const db = require("./config/dbConnect");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const notFoundRouter = require("./routes/notFoundRoutes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const responseHandler = require("./middlewares/responseHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
// const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
//   flags: 'a', // Append mode
// });
const app = express();
const port = process.env.PORT || 8000;

// Connect to the database
db();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan("tiny")); // For Logging the request
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/auth", authRouter); // Prefixed auth routes
app.use("/api/product", productRouter);
app.use(authRouter);
app.use(notFoundRouter);

// Custom middlewares
app.use(responseHandler);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);

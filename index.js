const express = require("express");
const db = require("./config/dbConnect");
const authRouter = require("./routes/authRoutes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const responseHandler = require("./middlewares/responseHandler");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;

db();
app.use(express.json());
app.use(authRouter);

// app.use(responseHandler);
app.use(errorHandler);
app.use(notFound);
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);

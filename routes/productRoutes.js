const {
  createProductController,
} = require("../controllers/product.controller");

const router = require("express").Router();
router.post("/create", createProductController);

// Fallback for unmatched routes in this router
router.all("*", (req, res, next) => {
  if (!res.locals.headersSend) {
    res.status(404);
    res.locals.isNotFound = true;
  }
  next(); // Pass to the next middleware (e.g., `notFound`)
});
module.exports = router;

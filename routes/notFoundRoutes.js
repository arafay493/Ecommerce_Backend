const router = require("express").Router();

router.all("*", (req, res, next) => {
  if (!res.locals.headersSend) {
    res.status(404);
    res.locals.isNotFound = true;
  }
  next(); // Pass to the next middleware (e.g., `notFound`)
});

module.exports = router;

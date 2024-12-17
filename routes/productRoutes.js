const {
  createProductController,
  getAllProductsController,
  getAllProductsWithPaginationController,
  getProductController,
  getSingleProductWithParamsIdController,
  updateProductController,
  deleteProductController,
} = require("../controllers/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.post("/create", authMiddleware, isAdmin, createProductController);
router.get("/getAll", getAllProductsController);
router.get("/get", getAllProductsWithPaginationController);
router.get("/getSingleProduct", getProductController);
router.put("/update", authMiddleware, isAdmin, updateProductController);
router.delete("/delete", authMiddleware, isAdmin, deleteProductController);
// router.get("/:id", getSingleProductWithParamsIdController);

// Fallback for unmatched routes in this router
// router.all("*", (req, res, next) => {
//   if (!res.locals.headersSend) {
//     res.status(404);
//     res.locals.isNotFound = true;
//   }
//   next(); // Pass to the next middleware (e.g., `notFound`)
// });
module.exports = router;

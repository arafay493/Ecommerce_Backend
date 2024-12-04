const {
  createUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  deleteUserByQueryParamsIdController,
  deleteUserByParamsIdController,
  updateUserController,
  updateUserSpecificFieldController,
  blockUserByParamsIdController,
} = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.get("/users", getAllUsersController);
router.get("/singleUser", authMiddleware, getUserByIdController);
router.get("/adminUser", authMiddleware, isAdmin, getUserByIdController);
router.delete("/singleUser/delete", deleteUserController);
router.delete("/delete", deleteUserByQueryParamsIdController);
router.delete("/delete/:userId", deleteUserByParamsIdController);
router.put("/singleUser/update", authMiddleware, updateUserController);
router.patch(
  "/singleUser/update/specific-field",
  authMiddleware,
  updateUserSpecificFieldController
);
router.post(
  "/block-user/:userId",
  authMiddleware,
  isAdmin,
  blockUserByParamsIdController
);

// Fallback for unmatched routes in this router
router.use((req, res, next) => {
  next(); // Pass to the next middleware (e.g., `notFound`)
});

module.exports = router;

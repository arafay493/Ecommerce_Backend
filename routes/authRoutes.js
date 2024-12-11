const {
  createUserController,
  loginUserController,
  logoutUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  deleteUserByQueryParamsIdController,
  deleteUserByParamsIdController,
  updateUserController,
  updateUserSpecificFieldController,
  blockUserByParamsIdController,
  unblockUserByParamsIdController,
  refreshTokenController,
} = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.get("/refresh", refreshTokenController);
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
router.patch(
  "/block-user/:userId",
  authMiddleware,
  isAdmin,
  blockUserByParamsIdController
);
router.patch(
  "/unblock-user/:userId",
  authMiddleware,
  isAdmin,
  unblockUserByParamsIdController
);

// Fallback for unmatched routes in this router
// router.use((req, res, next) => {
//   if (!res.headersSent) {
//     res.status(404);
//     res.locals.isNotFound = true;
//   }
//   next(); // Pass to the next middleware (e.g., `notFound`)
// });
// router.all("*", (req, res, next) => {
//   if (!res.locals.headersSend) {
//     res.status(404);
//     res.locals.isNotFound = true;
//   }
//   next(); // Pass to the next middleware (e.g., `notFound`)
// });

module.exports = router;

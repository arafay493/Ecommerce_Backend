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
} = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.get("/users", getAllUsersController);
router.get("/singleUser", authMiddleware, isAdmin, getUserByIdController);
router.delete("/singleUser/delete", deleteUserController);
router.delete("/delete", deleteUserByQueryParamsIdController);
router.delete("/delete/:userId", deleteUserByParamsIdController);
router.put("/singleUser/update", updateUserController);
router.patch(
  "/singleUser/update/specific-field",
  updateUserSpecificFieldController
);

module.exports = router;

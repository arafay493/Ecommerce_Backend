const {
  createUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  deleteUserByQueryParamsIdController,
  deleteUserByParamsIdController,
  updateUserController
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.get("/users", getAllUsersController);
router.get("/singleUser", getUserByIdController);
router.delete("/singleUser/delete", deleteUserController);
router.delete("/delete", deleteUserByQueryParamsIdController);
router.delete("/delete/:userId", deleteUserByParamsIdController);
router.put("/singleUser/update", updateUserController);

module.exports = router;

const {
  createUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.get("/users", getAllUsersController);
router.get("/singleUser", getUserByIdController);

module.exports = router;

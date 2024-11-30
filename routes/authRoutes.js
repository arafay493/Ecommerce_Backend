const {
  createUserController,
  loginUserController,
  getAllUsersController
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.get("/users", getAllUsersController);

module.exports = router;

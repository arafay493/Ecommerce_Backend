const {
  createUserController,
  loginUserController,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);

module.exports = router;

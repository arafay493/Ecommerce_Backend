const { createUser } = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", createUser);

module.exports = router;

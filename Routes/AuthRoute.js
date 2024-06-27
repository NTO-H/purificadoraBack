const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jw = require("jsonwebtoken");
const auth_controller = require("../Controllers/AuthController");

router.post("/signIn", auth_controller.Login);

module.exports = router;

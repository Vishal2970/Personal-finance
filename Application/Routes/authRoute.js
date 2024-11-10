const express = require("express");
const router = express.Router();
const controller = require("../Controllers/authControllers");

router.route("/login").post(controller.login);
router.route("/register").post(controller.register);
router.route("/verify-email").get(controller.verifyEmail);

module.exports = router;

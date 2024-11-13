const express = require("express");
const writeLog = require('../Utility/logger');
const router = express.Router();
const controller = require("../Controllers/authControllers");
writeLog(`entered in auth route`)
router.route("/login").post(controller.login);
router.route("/register").post(controller.register);
router.route("/verify-email").get(controller.verifyEmail);

module.exports = router;

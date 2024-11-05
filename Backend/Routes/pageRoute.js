const express = require("express");
const router = express.Router();
const controller = require("../Controllers/pageController");
const middleware = require('../Middleware/checkPermission')

router.route("/").get(middleware.isAdmin,controller.pageCheck);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../Controllers/pageController");
const middleware = require('../Middleware/checkPermission')

router.route("/").get(middleware.isTypeOfUser,(req,res)=>{
    req.user.isAdmin?controller.pageCheck(req,res):controller.pageCheckNormal(req,res);
})
router.route("/insertamount").post(middleware.isTypeOfUser,controller.insertingAmount);

router.route("/addamount").get(middleware.isTypeOfUser,controller.addAmount);

router.route("/list_of_transaction").get(middleware.isTypeOfUser,(req,res)=>{
    req.user.isAdmin?controller.listOfTransactionAdmin(req,res):controller.listOfTransactionNormal(req,res);
})


module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../Controllers/pageController");
const middleware = require("../Middleware/checkPermission");
// const writeLog = require("../Utility/logger");

// writeLog(`Entered in page Route`)
router.route("/").get(middleware.isTypeOfUser, (req, res) => {
  req.user.isAdmin
    ? controller.pageCheck(req, res)
    : controller.pageCheckNormal(req, res);
});
router
  .route("/insertamount")
  .post(middleware.isTypeOfUser, controller.insertingAmount);

router.route("/addamount").get(middleware.isTypeOfUser, controller.addAmount);

router
  .route("/list_of_transaction")
  .get(middleware.isTypeOfUser, controller.listOfTransactionAdmin);

router
  .route("/deleteOne")
  .delete(middleware.isTypeOfUser, controller.deleteParticularEntry);

router
  .route("/deleteAll")
  .delete(middleware.isTypeOfUser, controller.deleteAllforNormalOnly);
module.exports = router;